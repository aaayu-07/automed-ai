from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({"msg": "Missing fields"}), 400

    try:
        user_id = User.create_user(username, email, password)
        if not user_id:
            return jsonify({"msg": "User already exists"}), 400
        return jsonify({"msg": "User created", "user_id": user_id}), 201
    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"msg": f"Internal Server Error: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.get_by_email(email)
    if not user or not User.check_password(user['password'], password):
        return jsonify({"msg": "Invalid credentials"}), 401
    
    # Store minimal info in token
    access_token = create_access_token(identity=str(user['_id']), additional_claims={"role": user.get("role", "user")})
    return jsonify({"access_token": access_token, "username": user['username'], "role": user.get("role", "user")}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify({
        "username": user['username'],
        "email": user['email'],
        "role": user.get("role", "user")
    })
