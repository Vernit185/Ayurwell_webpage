print("Importing FastAPI...")
from fastapi import FastAPI, Depends, HTTPException, Query
print("Importing CORS...")
from fastapi.middleware.cors import CORSMiddleware
print("Importing pipeline...")
from backend.hybrid.pipeline import SearchPipeline
print("Pipeline imported!")
from backend.api.routers import product_search, knowledge_search
import os

app = FastAPI(title="AyurWell Website API", description="AI Product Recommendation Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_search.router)
app.include_router(knowledge_search.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, workers=1)
