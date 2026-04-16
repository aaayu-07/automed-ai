
from app import create_app
from models import mongo
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    hashed_password = generate_password_hash("admin123")
    result = mongo.db.users.update_one(
        {"email": "admin@automed.ai"},
        {"$set": {"password": hashed_password, "role": "admin", "username": "admin"}},
        upsert=True
    )
    print(f"Admin user updated/created. Matched: {result.matched_count}, Modified: {result.modified_count}, Upserted: {result.upserted_id}")
