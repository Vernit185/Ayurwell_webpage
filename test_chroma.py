import sys
print("starting", flush=True)
import os
print("imported os", flush=True)
import chromadb
print("imported chromadb", flush=True)
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
from chromadb.utils import embedding_functions
print("imported embedding_functions", flush=True)

CHROMA_DB_PATH = 'd:\\CSE AIML\\Ayurwell_website\\Data\\chroma_db'
print("path:", CHROMA_DB_PATH, flush=True)

try:
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    print("chroma_client created", flush=True)
except Exception as e:
    print("error creating client:", e, flush=True)

try:
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    print("sentence_transformer_ef created", flush=True)
except Exception as e:
    print("error creating sentence transformer:", e, flush=True)

try:
    disease_collection = chroma_client.get_or_create_collection(
        name="diseases", 
        embedding_function=sentence_transformer_ef
    )
    print("collection created", flush=True)
except Exception as e:
    print("error creating collection:", e, flush=True)
