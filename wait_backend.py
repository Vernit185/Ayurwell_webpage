import time
import requests

for i in range(30):
    try:
        res = requests.options("http://localhost:8000/products/search")
        if res.status_code == 200:
            print("Backend is up!")
            break
    except:
        pass
    print(f"Waiting for backend... {i}")
    time.sleep(5)
