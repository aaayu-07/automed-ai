
from healthlens import get_healthlens_analysis

def test_diabetes():
    print("Testing Diabetes HealthLens...")
    
    # High risk case
    features = {"Glucose": 150, "BMI": 35, "BloodPressure": 150, "Age": 50}
    result = get_healthlens_analysis('diabetes', features)
    print(f"High risk result: {result}")
    assert "High glucose level" in result['key_factors']
    assert "Elevated BMI" in result['key_factors']
    
    # Low risk case
    features = {"Glucose": 100, "BMI": 22, "BloodPressure": 110, "Age": 30}
    result = get_healthlens_analysis('diabetes', features)
    print(f"Low risk result: {result}")
    assert len(result['key_factors']) == 0
    assert "All monitored biomarkers" in result['explanation']
    print("✅ Diabetes tests passed\n")

def test_heart_failure():
    print("Testing Heart Failure HealthLens...")
    
    # High risk case
    features = {"Cholesterol": 250, "RestingBP": 145, "MaxHR": 175, "Age": 65}
    result = get_healthlens_analysis('lifestyle', features)
    print(f"High risk result: {result}")
    assert "High cholesterol level" in result['key_factors']
    assert "Elevated blood pressure" in result['key_factors']
    assert "Age factor (60+)" in result['key_factors']

    # Asymptomatic case
    features = {"ChestPainType": "ASY", "RestingBP": 120, "Cholesterol": 200}
    result = get_healthlens_analysis('lifestyle', features)
    print(f"Asymptomatic result: {result}")
    assert "Asymptomatic chest discomfort" in result['key_factors']
    
    print("✅ Heart Failure tests passed\n")

if __name__ == "__main__":
    try:
        test_diabetes()
        test_heart_failure()
        print("🎉 All logic tests passed!")
    except AssertionError as e:
        print(f"❌ Test failed: {e}")
    except Exception as e:
        print(f"❌ An error occurred: {e}")
