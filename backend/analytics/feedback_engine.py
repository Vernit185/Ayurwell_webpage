import json
import os

class FeedbackEngine:
    """
    Mock Feedback Engine (Analytics).
    In production, this would query a real SQL table for click-through rates.
    """
    def __init__(self):
        self.mock_analytics = {
            "Dabur Honitus Cough Syrup": {"clicks": 1500, "purchases": 300},
            "Himalaya Gasex Tablets": {"clicks": 800, "purchases": 120},
            "Patanjali Amla Juice": {"clicks": 2000, "purchases": 500}
        }
        
    def get_product_boost(self, product_name: str) -> float:
        """
        Returns a bounded analytics boost (0.0 to 0.1) based on engagement.
        """
        data = self.mock_analytics.get(product_name)
        if not data:
            return 0.0
            
        engagement_score = data["clicks"] + (data["purchases"] * 5)
        
        # Max boost is 0.1 for an engagement score >= 5000
        boost = min(0.1, (engagement_score / 5000) * 0.1)
        return boost
