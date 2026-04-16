from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, mongo, Prediction

admin_bp = Blueprint('admin', __name__)

def admin_required():
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    if not user or user.get('role') != 'admin':
        return False
    return True

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
        
    total_users = mongo.db.users.count_documents({})
    total_predictions = mongo.db.predictions.count_documents({})
    
    # Simple risk breakdown
    risk_counts = {
        "Low": mongo.db.predictions.count_documents({"risk_level": "Low"}),
        "Moderate": mongo.db.predictions.count_documents({"risk_level": "Moderate"}),
        "High": mongo.db.predictions.count_documents({"risk_level": "High"})
    }
    
    return jsonify({
        "total_users": total_users,
        "total_predictions": total_predictions,
        "risk_breakdown": risk_counts
    })

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
        
    users = list(mongo.db.users.find({}, {"password": 0}))
    for u in users:
        u['_id'] = str(u['_id'])
        u['created_at'] = u.get('created_at', 'N/A')
        
    return jsonify(users)

@admin_bp.route('/user/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
        
    from bson.objectid import ObjectId
    mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"msg": "User deleted"})

@admin_bp.route('/predictions', methods=['GET'])
@jwt_required()
def get_all_predictions():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
    
    # Fetch all predictions sorted by newest first
    predictions = list(mongo.db.predictions.find().sort("timestamp", -1))
    
    # Fetch all users to map IDs to details
    users = list(mongo.db.users.find({}, {"username": 1, "email": 1}))
    user_map = {str(u["_id"]): u for u in users}
    
    results = []
    for p in predictions:
        p["_id"] = str(p["_id"])
        user_id = p.get("user_id")
        user = user_map.get(user_id, {})
        
        results.append({
            "_id": p["_id"],
            "timestamp": p["timestamp"].isoformat() if p.get("timestamp") else None,
            "type": p.get("type", "Unknown"),
            "risk_level": p.get("risk_level", "Unknown"),
            "probability": p.get("probability", 0),
            "user": {
                "username": user.get("username", "Unknown User"),
                "email": user.get("email", "N/A")
            }
        })
        
    return jsonify(results)
