import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-prod"
    MONGO_URI = os.environ.get("MONGO_URI") or "mongodb://localhost:27017/lifestyle_disease_db"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "super-secret-jwt-key"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
