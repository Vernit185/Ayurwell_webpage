from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routers import product_search, knowledge_search
import os

app = FastAPI(title="AyurWell Website API", description="AI Product Recommendation Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(product_search.router)
app.include_router(knowledge_search.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, workers=1)
