from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Publication, User

publications_bp = Blueprint('publications', __name__)

def admin_required():
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    if not user or user.get('role') != 'admin':
        return False
    return True

@publications_bp.route('/', methods=['GET'])
def get_publications():
    pubs = Publication.get_all()
    for p in pubs:
        p['_id'] = str(p['_id'])
    return jsonify(pubs), 200

@publications_bp.route('/', methods=['POST'])
@jwt_required()
def add_publication():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
    
    data = request.json
    required_fields = ['title', 'authors', 'description', 'year', 'link', 'category']
    if not all(k in data for k in required_fields):
        return jsonify({"msg": "Missing fields"}), 400
        
    pub_id = Publication.create(data)
    return jsonify({"msg": "Publication added", "id": pub_id}), 201

@publications_bp.route('/<id>', methods=['PUT'])
@jwt_required()
def update_publication(id):
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
        
    data = request.json
    Publication.update(id, data)
    return jsonify({"msg": "Publication updated"}), 200

@publications_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_publication(id):
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403
        
    Publication.delete(id)
    return jsonify({"msg": "Publication deleted"}), 200
