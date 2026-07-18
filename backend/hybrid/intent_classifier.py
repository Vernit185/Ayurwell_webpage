import spacy
from typing import Dict, Any

class IntentClassifier:
    """
    Deterministically categorizes the user's search intent using rules and pattern matching.
    """
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            import en_core_web_sm
            self.nlp = en_core_web_sm.load()
            
        # Hardcoded knowledge lists for deterministic pattern matching
        self.known_brands = {"patanjali", "dabur", "himalaya", "zandu", "baidyanath", "kapiva"}
        self.known_herbs = {"ashwagandha", "tulsi", "yashtimadhu", "mulethi", "amla", "brahmi", "licorice"}
        
        # Heuristics for goals
        self.goal_keywords = {"immunity", "booster", "sleep", "digestion", "weight loss", "energy"}
        
    def classify(self, query: str) -> str:
        query_lower = query.lower()
        
        # 0. Show all products
        if query_lower == "all" or query_lower == "best":
            return "PRODUCT"
            
        # 1. Product Intent (Heuristic: usually contains a brand + a format/descriptor)
        if any(b in query_lower for b in self.known_brands) and \
           any(f in query_lower for f in ["syrup", "tablet", "powder", "juice", "churna", "drops"]):
            return "PRODUCT"
            
        # 2. Brand Intent (Heuristic: Exactly matches or primarily is a brand)
        if query_lower in self.known_brands or \
           all(token.lower_ in self.known_brands for token in self.nlp(query) if not token.is_stop):
            return "BRAND"
            
        # 3. Herb Intent
        if query_lower in self.known_herbs or \
           all(token.lower_ in self.known_herbs for token in self.nlp(query) if not token.is_stop):
            return "HERB"
            
        # 4. Goal Intent
        if any(g in query_lower for g in self.goal_keywords):
            return "GOAL"
            
        # 5. Symptom / Disease Intent
        # Default fallback for natural language clinical descriptions.
        # Examples: "I have acidity", "burning stomach", "cough and cold"
        return "SYMPTOM"
