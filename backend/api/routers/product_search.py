from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import time
import hashlib
import json

from backend.db.database import get_db
from backend.hybrid.pipeline import SearchPipeline
from backend.response.explainability import ExplainabilityEngine

router = APIRouter(prefix="/products", tags=["Product Search"])
explain_engine = ExplainabilityEngine()

# Simple Cache Layer (Could be replaced with Redis)
_CACHE = {}

class SearchRequest(BaseModel):
    query: str
    contraindications: Optional[List[str]] = []
    brand: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None

def get_cache_key(req: SearchRequest) -> str:
    # Hash query and all filter parameters to create a cache key
    key_str = f"{req.query.lower().strip()}_{','.join(req.contraindications or [])}_{req.brand}_{req.min_price}_{req.max_price}_{req.min_rating}"
    return hashlib.md5(key_str.encode()).hexdigest()

from backend.db.product_models import Product

@router.get("/brands")
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Product.brand).filter(Product.brand.isnot(None), Product.brand != '').distinct().all()
    # Flatten list of tuples and sort
    brands_list = sorted([b[0] for b in brands if b[0]])
    return {"status": "Success", "brands": brands_list}

@router.post("/search")
def product_search(req: SearchRequest, db: Session = Depends(get_db)):
    # 1. Cache Layer Check
    cache_key = get_cache_key(req)
    if cache_key in _CACHE:
        return _CACHE[cache_key]

    # 2. Execute Hybrid Retrieval Pipeline
    pipeline = SearchPipeline(db)
    session_context = {
        "contraindications": req.contraindications,
        "brand": req.brand,
        "min_price": req.min_price,
        "max_price": req.max_price,
        "min_rating": req.min_rating
    }
    pipeline_result = pipeline.execute(req.query, session_context)
    
    if pipeline_result["status"] != "Success":
        return pipeline_result
        
    predicted_disease = pipeline_result["predicted_disease"]
    
    # 3. Apply Explainability Engine
    final_results = []
    for rank_result in pipeline_result["results"]:
        product_obj = rank_result["product"]
        
        explanation = explain_engine.generate_explanation(rank_result, predicted_disease)
        
        final_results.append({
            "product": {
                "id": product_obj.id,
                "name": product_obj.product_name,
                "brand": product_obj.brand,
                "price": product_obj.price,
                "rating": product_obj.rating,
                "amazon_url": product_obj.amazon_url,
                "flipkart_url": product_obj.flipkart_url,
                "image": product_obj.image_url,
                "description": product_obj.description
            },
            "explainability": explanation
        })
        
    response_payload = {
        "status": "Success",
        "predicted_disease": predicted_disease["name"] if predicted_disease else None,
        "normalized_query": pipeline_result["normalized_query"],
        "results": final_results
    }
    
    # 4. Save to Cache
    _CACHE[cache_key] = response_payload
    
    return response_payload
