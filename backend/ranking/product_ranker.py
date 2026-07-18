from typing import List, Dict, Any
from backend.db.product_models import Product, Herb
from backend.analytics.feedback_engine import FeedbackEngine

class ProductRanker:
    """
    Deterministic Confidence-Based Ranking Engine.
    Filters out contraindications and calculates a final confidence score for each product.
    """
    def __init__(self):
        self.feedback_engine = FeedbackEngine()

    def rank_products(
        self, 
        products: List[Product], 
        predicted_disease: Dict[str, Any] = None, 
        recommended_herbs: List[Herb] = None,
        user_contraindications: List[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Takes SQL retrieved products and ranks them based on confidence score.
        If predicted_disease is None, we are bypassing medical matching (e.g. direct brand search),
        but still applying hard filters and quality/analytics boosting.
        """
        if user_contraindications is None:
            user_contraindications = []
        if recommended_herbs is None:
            recommended_herbs = []
            
        ranked_results = []
        
        disease_confidence = predicted_disease.get("confidence", 0.0) if predicted_disease else 1.0
        recommended_herb_names = {h.canonical_name for h in recommended_herbs}

        for product in products:
            # 1. Hard Filter: Contraindications
            is_contraindicated = False
            for herb in product.ingredients:
                for contra in herb.contraindications:
                    if contra.lower() in [uc.lower() for uc in user_contraindications]:
                        is_contraindicated = True
                        break
                if is_contraindicated:
                    break
                    
            if is_contraindicated:
                continue  # Skip this product entirely

            # 2. Herb Coverage (0.0 to 1.0)
            product_herb_names = {h.canonical_name for h in product.ingredients}
            
            if predicted_disease is None:
                # Direct product search -> 100% relevance to itself
                herb_coverage = 1.0
                symptom_relevance = 1.0
            else:
                if not recommended_herb_names:
                    herb_coverage = 0.0
                else:
                    intersection = recommended_herb_names.intersection(product_herb_names)
                    herb_coverage = len(intersection) / len(recommended_herb_names)
                symptom_relevance = herb_coverage * 0.8
            
            # 3. Quality Multiplier (0.8 to 1.1)
            rating = product.rating or 0.0
            quality_multiplier = 0.8 + ((rating / 5.0) * 0.3)
            
            # 4. Analytics Boost (0.0 to 0.1)
            analytics_boost = self.feedback_engine.get_product_boost(product.product_name)
            
            # Calculate Final Score
            final_score = ((disease_confidence * 0.4) + (herb_coverage * 0.4) + (symptom_relevance * 0.2)) * quality_multiplier + analytics_boost
            
            # Cap at 1.0
            final_score = min(1.0, final_score)
            
            ranked_results.append({
                "product": product,
                "score": round(final_score, 3),
                "herb_coverage": herb_coverage,
                "matched_herbs": list(recommended_herb_names.intersection(product_herb_names)) if predicted_disease else list(product_herb_names)
            })
            
        # Sort descending by score
        ranked_results.sort(key=lambda x: x["score"], reverse=True)
        return ranked_results
