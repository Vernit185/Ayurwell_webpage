import requests
import json

try:
    res = requests.post("http://localhost:8000/products/search", json={"query": "all"})
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
