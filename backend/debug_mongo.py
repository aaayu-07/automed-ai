import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi

# Load .env explicitly
load_dotenv()

uri = os.environ.get("MONGO_URI")
print(f"DEBUG: Loaded MONGO_URI: {uri}")

if not uri:
    print("ERROR: MONGO_URI is missing!")
    exit(1)

try:
    # Test connection
    client = MongoClient(uri, tlsCAFile=certifi.where())
    db = client.get_default_database()
    print(f"SUCCESS: Connected to database: {db.name}")
    
    # Try a simple command
    print("Ping:", db.command('ping'))
    
except Exception as e:
    print(f"CONNECTION FAILED: {e}")
