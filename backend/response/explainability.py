from typing import Dict, Any, List
from backend.db.product_models import Product

class ExplainabilityEngine:
    def __init__(self):
        pass
        
    def generate_explanation(self, rank_result: Dict[str, Any], predicted_disease: Dict[str, Any]) -> Dict[str, Any]:
        product: Product = rank_result["product"]
        score = rank_result["score"]
        matched_herbs = rank_result["matched_herbs"]
        
        # Determine confidence level string
        if score > 0.8:
            confidence_level = "High"
        elif score > 0.5:
            confidence_level = "Medium"
        else:
            confidence_level = "Low"
            
        reasons = []
        
        # Reason 1: Disease match
        if predicted_disease:
            reasons.append(f"Your query most closely matched '{predicted_disease['name']}'.")
            
            # Reason 2: Herb match
            matched_herbs = rank_result.get("matched_herbs", [])
            if matched_herbs:
                reasons.append(f"{', '.join(matched_herbs)} are recommended herbs for this condition.")
                reasons.append(f"This product contains {', '.join(matched_herbs)}.")
            else:
                reasons.append("This product is generally supportive but does not contain the primary recommended herbs.")
        else:
            reasons.append(f"Direct match for '{product.product_name}' or its brand '{product.brand}'.")
            
        # 3. Quality reason
        if product.rating and product.rating >= 4.5:
            reasons.append(f"Product is highly rated ({product.rating}★).")
        elif product.rating and product.rating >= 4.0:
            reasons.append(f"Product has a good rating ({product.rating}★).")
            
        return {
            "confidence_level": confidence_level,
            "score": score,
            "reasons": reasons
        }
