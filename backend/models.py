from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

mongo = PyMongo()

class User:
    @staticmethod
    def create_user(username, email, password, role="user"):
        users = mongo.db.users
        if users.find_one({"email": email}):
            return None
        
        hashed_password = generate_password_hash(password)
        user_id = users.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": role,
            "created_at": datetime.utcnow()
        }).inserted_id
        
        return str(user_id)

    @staticmethod
    def get_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def get_by_id(user_id):
        from bson.objectid import ObjectId
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    def check_password(hashed_password, password):
        return check_password_hash(hashed_password, password)

class Prediction:
    @staticmethod
    def save_prediction(user_id, prediction_type, inputs, result, probability, risk_level, healthlens=None, riskflow=None):
        predictions = mongo.db.predictions
        prediction_doc = {
            "user_id": user_id,
            "type": prediction_type, # 'diabetes' or 'lifestyle'
            "inputs": inputs,
            "result": result, # 0 or 1
            "probability": probability,
            "risk_level": risk_level,
            "timestamp": datetime.utcnow()
        }
        if healthlens:
            prediction_doc["healthlens"] = healthlens
        if riskflow:
            prediction_doc["riskflow"] = riskflow
            
        prediction_id = predictions.insert_one(prediction_doc).inserted_id
        return str(prediction_id)

    @staticmethod
    def get_user_history(user_id, prediction_type=None):
        query = {"user_id": user_id}
        if prediction_type:
            query["type"] = prediction_type
        return list(mongo.db.predictions.find(query).sort("timestamp", -1))

class Publication:
    @staticmethod
    def create(data):
        data['created_at'] = datetime.utcnow()
        return str(mongo.db.publications.insert_one(data).inserted_id)

    @staticmethod
    def get_all():
        # Sort by year descending, then created_at descending
        return list(mongo.db.publications.find().sort([("year", -1), ("created_at", -1)]))

    @staticmethod
    def update(pub_id, data):
        from bson.objectid import ObjectId
        mongo.db.publications.update_one({"_id": ObjectId(pub_id)}, {"$set": data})

    @staticmethod
    def delete(pub_id):
        from bson.objectid import ObjectId
        mongo.db.publications.delete_one({"_id": ObjectId(pub_id)})
