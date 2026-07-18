from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.hybrid.query_rewriter import QueryRewriter
from backend.hybrid.intent_classifier import IntentClassifier
from backend.hybrid.medical_understanding import search_disease
from backend.ranking.product_ranker import ProductRanker
import requests
import concurrent.futures
from backend.db.product_models import Herb, HerbAlias, Product

class SearchPipeline:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.rewriter = QueryRewriter()
        self.classifier = IntentClassifier()
        self.ranker = ProductRanker()
        
    def _fetch_live_products(self, query: str, all_herbs: List[Herb] = None) -> List[Product]:
        if all_herbs is None:
            all_herbs = self.db.query(Herb).all()
            
        combined_products = []
        
        combined_products = []
        
        def scrape_amazon():
            try:
                res = requests.get(f"http://localhost:5173/api/scrape-amazon?q={query}", timeout=15)
                if res.status_code == 200:
                    return res.json().get("products", [])
            except Exception as e:
                print("Amazon live scrape failed:", e)
            return []

        def scrape_flipkart():
            try:
                res = requests.get(f"http://localhost:5173/api/scrape-flipkart?q={query}", timeout=15)
                if res.status_code == 200:
                    return res.json().get("products", [])
            except Exception as e:
                print("Flipkart live scrape failed:", e)
            return []

        # Run concurrently to halve the time
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_amz = executor.submit(scrape_amazon)
            future_flp = executor.submit(scrape_flipkart)
            
            amz_data = future_amz.result()
            flp_data = future_flp.result()

        new_products_to_add = []
        
        for p in amz_data:
            url = p["url"]
            existing = self.db.query(Product).filter(Product.amazon_url == url).first()
            if existing:
                combined_products.append(existing)
            else:
                prod = Product(
                    product_name=p["name"],
                    brand=p["brand"],
                    price=float(p["price"]) if str(p["price"]).replace('.','').isdigit() else 200.0,
                    rating=float(p["rating"]) if str(p["rating"]).replace('.','').isdigit() else 4.0,
                    amazon_url=url,
                    image_url=p["image"],
                    description="Live from Amazon"
                )
                new_products_to_add.append(prod)
                combined_products.append(prod)

        for p in flp_data:
            url = p["url"]
            existing = self.db.query(Product).filter(Product.flipkart_url == url).first()
            if existing:
                combined_products.append(existing)
            else:
                prod = Product(
                    product_name=p["name"],
                    brand=p["brand"],
                    price=float(p["price"]) if str(p["price"]).replace('.','').isdigit() else 200.0,
                    rating=float(p["rating"]) if str(p["rating"]).replace('.','').isdigit() else 4.0,
                    flipkart_url=url,
                    image_url=p["image"],
                    description="Live from Flipkart"
                )
                new_products_to_add.append(prod)
                combined_products.append(prod)

        # Permanently save dynamically fetched products to the database
        if new_products_to_add:
            try:
                self.db.add_all(new_products_to_add)
                self.db.commit()
            except Exception as e:
                print("Failed to commit new products:", e)
                self.db.rollback()

        # 3. Dynamic Herb Parsing for Safety checks
        for prod in combined_products:
            prod_name_lower = prod.product_name.lower()
            ingredients = []
            for herb in all_herbs:
                if herb.canonical_name.lower() in prod_name_lower:
                    ingredients.append(herb)
                else:
                    for alias in herb.aliases:
                        if alias.alias_name.lower() in prod_name_lower:
                            ingredients.append(herb)
                            break
            prod.ingredients = ingredients

        return combined_products

    def _filter_products(self, products: List[Product], session_context: Dict[str, Any]) -> List[Product]:
        filtered = []
        brand_filter = session_context.get("brand")
        min_price = session_context.get("min_price")
        max_price = session_context.get("max_price")
        min_rating = session_context.get("min_rating")
        
        for p in products:
            # Skip strict brand filtering in Python since we append the brand to the Amazon search query
            # and our scraper's brand extraction is unreliable (defaults to 'Ayurvedic Brand').
            # if brand_filter and brand_filter.lower() != "all brands" and brand_filter.lower() not in p.brand.lower():
            #     continue
            
            if min_price is not None and p.price < min_price:
                continue
            if max_price is not None and p.price > max_price:
                continue
            if min_rating is not None and p.rating < min_rating:
                continue
            filtered.append(p)
        return filtered

    def execute(self, raw_query: str, session_context: Dict[str, Any] = None) -> Dict[str, Any]:
        if session_context is None:
            session_context = {}
            
        user_contraindications = session_context.get("contraindications", [])
            
        # 1. Query Rewriting & Normalization
        normalized_query = self.rewriter.rewrite(raw_query)
        
        # 2. Intent Classification
        intent = self.classifier.classify(normalized_query)
        
        # 3. Branching Logic
        if intent in ["PRODUCT", "BRAND"]:
            # Bypass Semantic Medical Search, but use Live Scraper
            search_query = "Ayurvedic products" if raw_query.lower() in ["all", "best"] else raw_query
            # If a specific brand is selected, we can append it to the search query for better Amazon results
            brand = session_context.get("brand")
            if brand and brand.lower() != "all brands" and brand.lower() not in search_query.lower():
                search_query = f"{brand} {search_query}"
                
            products = self._fetch_live_products(search_query)
            products = self._filter_products(products, session_context)
            
            # Still rank them (for analytics/quality) but no disease mapping
            ranked_products = self.ranker.rank_products(
                products=products,
                predicted_disease=None,
                recommended_herbs=[],
                user_contraindications=user_contraindications
            )
            
            return {
                "status": "Success",
                "intent": intent,
                "predicted_disease": None,
                "normalized_query": normalized_query,
                "results": ranked_products
            }
            
        # 4. Medical Understanding (Semantic Search) for SYMPTOM/GOAL/DISEASE
        predicted_disease = search_disease(normalized_query)
        
        # If we can't confidently map the disease (confidence < 0.45) or no disease is found
        if not predicted_disease or predicted_disease["confidence"] < 0.45:
            # Fallback: We don't have the medical mapping for this symptom (e.g. backpain).
            # Instead of failing, we fetch live Amazon products for the query directly!
            search_query = normalized_query
            brand = session_context.get("brand")
            if brand and brand.lower() != "all brands" and brand.lower() not in search_query.lower():
                search_query = f"{brand} {search_query}"
                
            products = self._fetch_live_products(search_query, all_herbs=self.db.query(Herb).all())
            products = self._filter_products(products, session_context)
            
            ranked_products = self.ranker.rank_products(
                products=products,
                predicted_disease=None,
                recommended_herbs=[],
                user_contraindications=user_contraindications
            )
            return {
                "status": "Success",
                "message": "Direct search fallback (medical mapping not found in DB).",
                "intent": intent,
                "predicted_disease": None,
                "normalized_query": normalized_query,
                "results": ranked_products
            }
            
        # 5. Herb / Formulation Mapping (SQL Lookup)
        all_herbs = self.db.query(Herb).all()
        recommended_herbs = [
            h for h in all_herbs 
            if any(d.lower() in predicted_disease["name"].lower() or predicted_disease["name"].lower() in d.lower() for d in h.diseases_supported)
        ]
        
        if not recommended_herbs:
            search_query = normalized_query
            brand = session_context.get("brand")
            if brand and brand.lower() != "all brands" and brand.lower() not in search_query.lower():
                search_query = f"{brand} {search_query}"
                
            products = self._fetch_live_products(search_query, all_herbs=self.db.query(Herb).all())
            products = self._filter_products(products, session_context)
            ranked_products = self.ranker.rank_products(
                products=products,
                predicted_disease=predicted_disease,
                recommended_herbs=[],
                user_contraindications=user_contraindications
            )
            return {
                "status": "Success",
                "intent": intent,
                "predicted_disease": predicted_disease,
                "normalized_query": normalized_query,
                "results": ranked_products
            }
            
        # 6. Product Retrieval (Live Web Scraping mapped to Herbs)
        search_query = normalized_query
        brand = session_context.get("brand")
        if brand and brand.lower() != "all brands" and brand.lower() not in search_query.lower():
            search_query = f"{brand} {search_query}"
            
        products = self._fetch_live_products(search_query, all_herbs)
        products = self._filter_products(products, session_context)
        
        # 7. Deterministic Ranking & Contraindication Filtering
        ranked_products = self.ranker.rank_products(
            products=products,
            predicted_disease=predicted_disease,
            recommended_herbs=recommended_herbs,
            user_contraindications=user_contraindications
        )
        
        return {
            "status": "Success",
            "intent": intent,
            "predicted_disease": predicted_disease,
            "normalized_query": normalized_query,
            "results": ranked_products
        }
