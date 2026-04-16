import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

coach_bp = Blueprint('coach', __name__)

# Configure Gemini
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@coach_bp.route('/generate_tips', methods=['POST'])
@jwt_required()
def generate_tips():
    data = request.json
    risk_level = data.get('risk_level', 'Unknown')
    probability = data.get('probability', 0)
    factors = data.get('factors', [])
    prediction_type = data.get('prediction_type', 'General')

    # Fallback if no key
    if not GEMINI_API_KEY:
        return jsonify({
            "tips": [
                "Stay hydrated and drink at least 8 glasses of water daily.",
                "Maintain a balanced diet rich in vegetables and whole grains.",
                "Aim for at least 30 minutes of moderate exercise most days."
            ],
            "note": "AI customization unavailable (API Key missing)."
        })

    lifestyle_responses = data.get('lifestyle_responses', {})

    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Build lifestyle context string
        lifestyle_context = ""
        if lifestyle_responses:
            lifestyle_context = "User Lifestyle Context (Self-reported):\n"
            for question, answer in lifestyle_responses.items():
                lifestyle_context += f"- {question.replace('_', ' ').title()}: {answer}\n"

        prompt = f"""
        Act as an empathetic and professional AI Health Coach.
        The user has just received a health risk assessment for {prediction_type}.
        
        Result Details:
        - Risk Level: {risk_level}
        - Probability: {probability}%
        - Contributing Factors: {', '.join(factors) if factors else 'General assessment'}
        
        {lifestyle_context}
        
        Based on the medical risk AND their reported lifestyle, provide exactly 3 highly personalized, actionable, and encouraging health tips.
        If they reported specific unhealthy habits (like high sugar, smoking, lack of sleep), DIRECTLY address those in the tips.
        
        Format constraints:
        - Return ONLY the tips as a JSON list of strings.
        - Do not include any markdown formatting or extra text.
        - Keep each tip under 25 words.
        - Focus on immediate, achievable steps.
        """
        
        response = model.generate_content(prompt)
        
        # Simple parsing cleanup to ensure list format
        text = response.text.strip()
        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        import json
        try:
            tips = json.loads(text)
        except:
            # Fallback if JSON parsing fails, split by newlines or numbers
            tips = [line.strip().lstrip('- ').lstrip('123. ') for line in text.split('\n') if line.strip()]
            tips = tips[:3] # Ensure max 3

        return jsonify({"tips": tips})

    except Exception as e:
        print(f"Error generating tips: {e}")
        return jsonify({
            "tips": [
                "Prioritize sleep to help your body recover.",
                "Consult with a healthcare provider for a detailed plan.",
                "Monitor your vitals regularly."
            ],
            "error": "AI service temporarily unavailable."
        })
