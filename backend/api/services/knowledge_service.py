import logging
from typing import List, Dict, Any

try:
    from ddgs import DDGS
except ImportError:
    try:
        from duckduckgo_search import DDGS
    except ImportError:
        DDGS = None

logger = logging.getLogger(__name__)

class KnowledgeSearchService:
    def __init__(self):
        self.trusted_domains = [
            "nih.gov", "ayush.gov.in", "sciencedirect.com", "pubmed.ncbi.nlm.nih.gov",
            "nccih.nih.gov", "who.int", "jaim.in", "ncbi.nlm.nih.gov",
            "hindawi.com", "nature.com", "frontiersin.org", "springer.com",
            "bmccomplementmedtherapies.biomedcentral.com", "tandfonline.com", "onlinelibrary.wiley.com",
            "mdpi.com", "bmj.com", "plos.org", "thelancet.com", "japi.org",
            "banyanbotanicals.com", "chopra.com", "easyayurveda.com", "kottakkal.com",
            "dabur.com", "patanjaliayurved.net", "keralatourism.org",
            "healthline.com", "webmd.com", "mayoclinic.org", "clevelandclinic.org",
            "aafp.org"
        ]
        
    def is_available(self) -> bool:
        """Check if the search backend is installed."""
        return DDGS is not None

    def build_query(self, query: str) -> str:
        """Construct the site-filtered search query."""
        site_query = " OR ".join([f"site:{domain}" for domain in self.trusted_domains])
        return f"{query} Ayurveda ({site_query})"

    def execute_search(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Execute the search against DuckDuckGo."""
        if not self.is_available():
            raise Exception("Search engine dependency not installed.")
            
        search_term = self.build_query(query)
        results = []
        
        try:
            ddgs = DDGS()
            ddg_results = ddgs.text(search_term, max_results=max_results)
            
            for item in ddg_results:
                results.append({
                    "title": item.get('title', 'Unknown Title'),
                    "category": "Web Search",
                    "author": item.get('href', '').split('/')[2] if 'href' in item else "Web Source",
                    "description": item.get('body', ''),
                    "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
                    "link": item.get('href', '#')
                })
        except Exception as e:
            logger.error(f"Error during DuckDuckGo search: {e}")
            
        return results
