
import urllib.request
import json
import sys

url = "http://localhost:5001/api/auth/login"
data = {"email": "monitor@test.com", "password": "password123"}
headers = {'Content-Type': 'application/json'}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers)
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
