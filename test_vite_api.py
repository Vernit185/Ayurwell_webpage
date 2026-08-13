import urllib.request
import json

try:
    with urllib.request.urlopen("http://localhost:5173/api/scrape-amazon?q=all") as response:
        print(response.read().decode())
except Exception as e:
    print(f"Error: {e}")
