
def analyze_diabetes(features):
    """
    Rule-based logic for diabetes risk explanation.
    Thresholds:
    - Glucose ≥ 140
    - BMI ≥ 30
    - BloodPressure ≥ 140
    - Age ≥ 45
    """
    factors = []
    
    glucose = features.get('Glucose', features.get('glucose', 0))
    bmi = features.get('BMI', features.get('bmi', 0))
    bp = features.get('BloodPressure', features.get('blood_pressure', 0))
    age = features.get('Age', features.get('age', 0))

    if glucose >= 140:
        factors.append("High glucose level")
    if bmi >= 30:
        factors.append("Elevated BMI")
    if bp >= 140:
        factors.append("High blood pressure")
    if age >= 45:
        factors.append("Age factor (45+)")

    if not factors:
        explanation = "All monitored biomarkers are currently within standard ranges. Maintaining these levels through diet and activity is recommended."
    else:
        # Join factors for explanation
        factor_str = " and ".join([", ".join(factors[:-1]), factors[-1]] if len(factors) > 1 else factors)
        explanation = f"{factor_str} significantly contributed to the predicted risk level."

    return {
        "key_factors": factors,
        "explanation": explanation
    }

def analyze_heart_failure(features):
    """
    Rule-based logic for heart failure risk explanation.
    Thresholds:
    - Cholesterol ≥ 240
    - BloodPressure (RestingBP) ≥ 140
    - MaxHR (representing activity levels/stress) ≥ 170 (Adjusted from user's 90 for resting_heart_rate)
    - BMI ≥ 30 (If provided)
    - Age ≥ 60 (Additional context for heart failure)
    """
    factors = []
    
    cholesterol = features.get('Cholesterol', features.get('cholesterol', 0))
    bp = features.get('RestingBP', features.get('blood_pressure', 0))
    max_hr = features.get('MaxHR', features.get('resting_heart_rate', 0))
    bmi = features.get('BMI', features.get('bmi', 0))
    age = features.get('Age', features.get('age', 0))

    if cholesterol >= 240:
        factors.append("High cholesterol level")
    if bp >= 140:
        factors.append("Elevated blood pressure")
    if max_hr >= 170:
        factors.append("Elevated peak heart rate")
    if bmi >= 30:
        factors.append("Elevated BMI")
    if age >= 60:
        factors.append("Age factor (60+)")

    # Special handling for chest pain
    cp_type = features.get('ChestPainType', '')
    if cp_type == 'ASY':
         factors.append("Asymptomatic chest discomfort")

    if not factors:
        explanation = "The analysis shows clinical indicators are largely within standard medical thresholds, suggesting a lower emphasis on metabolic risk factors."
    else:
        factor_str = " and ".join([", ".join(factors[:-1]), factors[-1]] if len(factors) > 1 else factors)
        explanation = f"Factors such as {factor_str} were identified as primary contributors to the risk profile."

    return {
        "key_factors": factors,
        "explanation": explanation
    }

def get_healthlens_analysis(disease_type, features):
    if disease_type == 'diabetes':
        return analyze_diabetes(features)
    elif disease_type in ['lifestyle', 'heart_failure']:
        return analyze_heart_failure(features)
    else:
        return {
            "key_factors": [],
            "explanation": "No specific disease profile identified for advanced analysis."
        }
