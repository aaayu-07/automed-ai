
from app import create_app
from models import mongo, User
from werkzeug.security import generate_password_hash
import datetime

app = create_app()

with app.app_context():
    existing_admin = mongo.db.users.find_one({"role": "admin"})
    if existing_admin:
        print(f"Admin already exists: {existing_admin['username']}")
    else:
        # Create default admin
        admin_data = {
            "username": "admin",
            "email": "admin@automed.ai",
            "password": generate_password_hash("admin123"),
            "role": "admin",
            "created_at": datetime.datetime.utcnow()
        }
        mongo.db.users.insert_one(admin_data)
        print("Created default admin user.")
        print("Username: admin")
        print("Email: admin@automed.ai")
        print("Password: admin123")
