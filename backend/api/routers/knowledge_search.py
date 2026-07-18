from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional

try:
    from ddgs import DDGS
except ImportError:
    try:
        from duckduckgo_search import DDGS
    except ImportError:
        DDGS = None

router = APIRouter(prefix="/api/articles", tags=["articles"])

class ArticleSearchResponse(BaseModel):
    title: str
    category: str
    author: str
    description: str
    image: str
    link: str

@router.get("/search", response_model=List[ArticleSearchResponse])
async def search_articles(q: str = Query(..., min_length=2, description="Search query")):
    if DDGS is None:
        raise HTTPException(status_code=500, detail="duckduckgo_search module not installed")
        
    trusted_domains = [
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
    site_query = " OR ".join([f"site:{domain}" for domain in trusted_domains])
    
    # Append site modifiers for authenticity
    search_term = f"{q} Ayurveda ({site_query})"
    
    results = []
    try:
        # DDGS().text() returns a generator of dictionaries with 'title', 'href', 'body'
        ddgs = DDGS()
        ddg_results = ddgs.text(search_term, max_results=10)
        
        for item in ddg_results:
            results.append(ArticleSearchResponse(
                title=item.get('title', 'Unknown Title'),
                category="Web Search",  # Default category for dynamic results
                author=item.get('href', '').split('/')[2] if 'href' in item else "Web Source", # Extract domain as author
                description=item.get('body', ''),
                image="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80", # Fallback image
                link=item.get('href', '#')
            ))
            
    except Exception as e:
        print(f"Error during DuckDuckGo search: {e}")
        # In case of error (like rate limit), return empty list or re-raise
        pass
        
    return results
