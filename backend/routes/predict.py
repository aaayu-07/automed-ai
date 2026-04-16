import os
import joblib
import numpy as np
import pandas as pd
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Prediction, User
from utils import generate_pdf_report
from healthlens import get_healthlens_analysis
from riskflow import analyze_risk_trend

predict_bp = Blueprint('predict', __name__)

# Load models at module level.
# NOTE: In production, consider lazy loading or app context, but this is fine for capstone.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

try:
    diabetes_model = joblib.load(os.path.join(MODELS_DIR, "diabetes_model.pkl"))
    diabetes_scaler = joblib.load(os.path.join(MODELS_DIR, "diabetes_scaler.pkl"))
    lifestyle_model = joblib.load(os.path.join(MODELS_DIR, "lifestyle_model.pkl"))
    # lifestyle_scaler is now part of the pipeline in lifestyle_model
    print("✅ Models loaded successfully in blueprint")
except Exception as e:
    print(f"❌ Error loading models: {e}")

@predict_bp.route('/diabetes', methods=['POST'])
@jwt_required()
def predict_diabetes():
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Expected order needs to verify with training script, but generally dict values match if order preserved.
    # Ideally should map by key names.
    # From diabetes_train.py: Cols: ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age", "Pregnancies"?]
    # Actually wait, let's just trust the input is sent in correct order or map it explicitly.
    # The original app.py just took values(). Let's stick to that for now but add validation later.
    
    try:
        features = np.array([list(data.values())]) 
        scaled = diabetes_scaler.transform(features)
        prediction = diabetes_model.predict(scaled)[0]
        probability = diabetes_model.predict_proba(scaled)[0][1]
        
        if probability < 0.3:
            risk = "Low"
        elif probability < 0.7:
            risk = "Moderate"
        else:
            risk = "High"
            
        # HealthLens AI Explanation
        healthlens_data = get_healthlens_analysis('diabetes', data)
        
        # RiskFlow Engine Analysis
        history = Prediction.get_user_history(current_user_id, 'diabetes')
        # We need to include the CURRENT prediction in the history analysis to see the trend leading up to today
        # history is newest first, so we'll prepend the current mock block before reversing/processing
        current_record = {"risk_level": risk, "timestamp": "now"}
        analysis_history = [current_record] + history
        riskflow_data = analyze_risk_trend(analysis_history)
            
        # Save to DB
        Prediction.save_prediction(
            user_id=current_user_id,
            prediction_type='diabetes',
            inputs=data,
            result=int(prediction),
            probability=round(float(probability), 3),
            risk_level=risk,
            healthlens=healthlens_data,
            riskflow=riskflow_data
        )
        
        return jsonify({
            "prediction": int(prediction),
            "probability": round(float(probability), 3),
            "risk_level": risk,
            "healthlens": healthlens_data,
            "riskflow": riskflow_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_bp.route('/lifestyle', methods=['POST'])
@jwt_required()
def predict_lifestyle():
    current_user_id = get_jwt_identity()
    data = request.json
    
    try:
        # The new model is a Pipeline that expects a DataFrame with named columns
        # keys in data must match: Age, Sex, ChestPainType, RestingBP, Cholesterol, FastingBS, RestingECG, MaxHR, ExerciseAngina, Oldpeak, ST_Slope
        df = pd.DataFrame([data])
        
        # Pipeline handles scaling and encoding internally
        prediction = lifestyle_model.predict(df)[0]
        probability = lifestyle_model.predict_proba(df)[0][1]
        
        if probability < 0.3:
            risk = "Low"
        elif probability < 0.7:
            risk = "Moderate"
        else:
            risk = "High"
            
        # HealthLens AI Explanation
        healthlens_data = get_healthlens_analysis('lifestyle', data)

        # RiskFlow Engine Analysis
        history = Prediction.get_user_history(current_user_id, 'lifestyle')
        current_record = {"risk_level": risk, "timestamp": "now"}
        analysis_history = [current_record] + history
        riskflow_data = analyze_risk_trend(analysis_history)

        Prediction.save_prediction(
            user_id=current_user_id,
            prediction_type='lifestyle',
            inputs=data,
            result=int(prediction),
            probability=round(float(probability), 3),
            risk_level=risk,
            healthlens=healthlens_data,
            riskflow=riskflow_data
        )
        
        return jsonify({
            "prediction": int(prediction),
            "probability": round(float(probability), 3),
            "risk_level": risk,
            "healthlens": healthlens_data,
            "riskflow": riskflow_data
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@predict_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    
    if user and user.get('role') == 'admin':
        # Admin sees all history
        history = list(mongo.db.predictions.find().sort("timestamp", -1))
    else:
        # Regular user sees their own history
        history = Prediction.get_user_history(current_user_id)
    
    # serialize ObjectId and Timestamp
    for item in history:
        item['_id'] = str(item['_id'])
        if item.get('timestamp'):
             item['timestamp'] = item['timestamp'].isoformat()
    
    return jsonify(history), 200

@predict_bp.route('/report/<prediction_id>', methods=['GET'])
@jwt_required()
def download_report(prediction_id):
    from bson.objectid import ObjectId
    from models import mongo # Import mongo to access DB directly
    
    current_user_id = get_jwt_identity()
    user = User.get_by_id(current_user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404

    prediction = None
    target_user = user

    try:
        if user.get('role') == 'admin':
            # Admin can access any prediction
            prediction = mongo.db.predictions.find_one({"_id": ObjectId(prediction_id)})
            if prediction:
                # Fetch the actual patient for the report
                target_user = User.get_by_id(prediction['user_id'])
        else:
            # Regular user: ensure they own the prediction
            prediction = mongo.db.predictions.find_one({
                "_id": ObjectId(prediction_id),
                "user_id": current_user_id
            })
    except Exception as e:
        return jsonify({"msg": "Invalid ID"}), 400
    
    if not prediction:
        return jsonify({"msg": "Prediction not found or access denied"}), 404
        
    try:
        pdf_buffer = generate_pdf_report(target_user, prediction)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"msg": "PDF Generation failed"}), 500
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"report_{prediction_id}.pdf",
        mimetype='application/pdf'
    )
