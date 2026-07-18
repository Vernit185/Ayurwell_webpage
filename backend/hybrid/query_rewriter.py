import spacy
from spacy.matcher import PhraseMatcher

class QueryRewriter:
    """
    Deterministically normalizes user queries:
    1. Corrects spelling based on predefined dictionaries
    2. Maps colloquial phrases to canonical medical concepts
    """
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            import en_core_web_sm
            self.nlp = en_core_web_sm.load()
            
        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        
        # Vernacular / Spelling corrections (Raw string replacements before spaCy)
        self.spell_corrections = {
            "mulethi": "yashtimadhu",
            "licorice": "yashtimadhu",
            "ashwaganda": "ashwagandha",
            "amla": "amalaki"
        }
        
        # Colloquial to Canonical Medical Mapping
        self.canonical_map = {
            "Flatulence": ["gas", "bloating", "farting", "wind", "gas problem"],
            "Hyperacidity": ["acidity", "heartburn", "burning stomach", "acid reflux", "stomach feels like it's on fire"],
            "Common Cold": ["cold", "coryza", "runny nose", "sneezing"],
            "Indigestion": ["upset stomach", "dyspepsia", "can't digest", "heavy stomach"],
            "Persistent Cough": ["dry cough", "wet cough", "phlegm", "hacking", "keep coughing"]
        }
        
        for canonical, phrases in self.canonical_map.items():
            patterns = [self.nlp.make_doc(text) for text in phrases]
            self.matcher.add(canonical, patterns)
            
    def rewrite(self, query: str) -> str:
        # 1. Spelling and simple term replacement
        words = query.lower().split()
        corrected_words = [self.spell_corrections.get(w, w) for w in words]
        corrected_query = " ".join(corrected_words)
        
        # 2. Canonical concept extraction
        doc = self.nlp(corrected_query)
        matches = self.matcher(doc)
        
        matched_concepts = set()
        for match_id, start, end in matches:
            concept = self.nlp.vocab.strings[match_id]
            matched_concepts.add(concept)
            
        # 3. Construct rewritten query
        if matched_concepts:
            return corrected_query + " " + " ".join(matched_concepts)
            
        return corrected_query
