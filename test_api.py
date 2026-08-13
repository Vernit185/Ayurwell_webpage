import requests
try:
    r = requests.post('http://localhost:8000/products/search', json={'query': 'all'})
    print(r.json())
except Exception as e:
    print("Error:", e)
