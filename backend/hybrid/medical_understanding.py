import os
import chromadb
from chromadb.utils import embedding_functions

# Initialize ChromaDB Local Client
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), '../../Data/chroma_db')
os.makedirs(CHROMA_DB_PATH, exist_ok=True)

chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

# Use lightweight fast sentence transformer
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# Get or create the collections
disease_collection = chroma_client.get_or_create_collection(
    name="diseases", 
    embedding_function=sentence_transformer_ef
)

herb_collection = chroma_client.get_or_create_collection(
    name="herbs", 
    embedding_function=sentence_transformer_ef
)

def seed_semantic_knowledge():
    """Seeds ChromaDB with initial Disease and Herb knowledge vectors."""
    # 1. Seed Diseases
    if disease_collection.count() == 0:
        diseases = [
            {"id": "d1", "name": "Hyperacidity (Amlapitta)", "text": "Burning sensation in stomach, heartburn, acidity, acid reflux. Caused by excess Pitta."},
            {"id": "d2", "name": "Common Cold", "text": "Runny nose, cough, sneezing, sore throat, mild fever. Caused by Vata and Kapha imbalance."},
            {"id": "d3", "name": "Indigestion (Ajeerna)", "text": "Upset stomach, bloating, gas, flatulence, inability to digest food properly."}
        ]
        
        disease_collection.add(
            ids=[d["id"] for d in diseases],
            documents=[d["text"] for d in diseases],
            metadatas=[{"name": d["name"]} for d in diseases]
        )
        print("Seeded Disease Collection.")

    # 2. Seed Herbs
    if herb_collection.count() == 0:
        herbs = [
            {"id": "h1", "name": "Yashtimadhu", "text": "Licorice. Good for throat, relieves heartburn and acidity, balances Pitta."},
            {"id": "h2", "name": "Tulsi", "text": "Holy Basil. Boosts immunity, clears congestion, good for cough and cold."},
            {"id": "h3", "name": "Amla", "text": "Indian Gooseberry. High vitamin C, excellent for digestion, relieves burning sensation."}
        ]
        
        herb_collection.add(
            ids=[h["id"] for h in herbs],
            documents=[h["text"] for h in herbs],
            metadatas=[{"name": h["name"]} for h in herbs]
        )
        print("Seeded Herb Collection.")

def search_disease(query: str, top_k: int = 1):
    """Semantically search for the most likely disease."""
    results = disease_collection.query(
        query_texts=[query],
        n_results=top_k
    )
    
    if results['distances'] and results['distances'][0]:
        # Simple inversion to get a confidence score (0-1) where lower distance = higher confidence
        # MiniLM uses cosine distance by default in Chroma. 1 - (dist/2) gives cosine similarity.
        similarity = max(0.0, 1.0 - (results['distances'][0][0] / 2.0))
        return {
            "disease_id": results['ids'][0][0],
            "name": results['metadatas'][0][0]['name'],
            "confidence": similarity
        }
    return None

if __name__ == "__main__":
    seed_semantic_knowledge()
