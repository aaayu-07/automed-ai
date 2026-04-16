import sys
import os
from pymongo import MongoClient
import certifi
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

sys.path.append(os.path.join(os.getcwd(), 'backend'))

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI') or "mongodb://localhost:27017/lifestyle_disease_db"

if not MONGO_URI:
    # Fallback or error
    print("MONGO_URI not found in environment!")
    sys.exit(1)

def create_admin_user():
    print(f"Connecting to MongoDB...")
    # Use tlsAllowInvalidCertificates=True to avoid SSL handshake errors
    client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
    db = client.get_database() # Uses the default db in URI
    
    users_collection = db.users
    
    email = "admin@automed.ai"
    password = "admin123"
    
    user = users_collection.find_one({"email": email})
    
    if user:
        print(f"User {email} exists. Updating password and role...")
        users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "password": generate_password_hash(password),
                    "role": "admin"
                }
            }
        )
        print("Admin user updated successfully.")
    else:
        print(f"Creating new admin user {email}...")
        from datetime import datetime
        users_collection.insert_one({
            "username": "Admin User",
            "email": email,
            "password": generate_password_hash(password),
            "role": "admin",
            "created_at": datetime.utcnow()
        })
        print("Admin user created successfully.")

if __name__ == "__main__":
    create_admin_user()

if __name__ == "__main__":
    create_admin_user()
