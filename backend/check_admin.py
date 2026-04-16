
from app import create_app
from models import mongo

app = create_app()

with app.app_context():
    admins = list(mongo.db.users.find({"role": "admin"}))
    if admins:
        print(f"Found {len(admins)} admin(s):")
        for admin in admins:
            print(f"- Username: {admin['username']}, Email: {admin['email']}")
    else:
        print("No admin users found.")
