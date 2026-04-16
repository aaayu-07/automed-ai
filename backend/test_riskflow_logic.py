
from riskflow import analyze_risk_trend

def test_riskflow():
    print("Testing RiskFlow Engine...")
    
    # Not enough data
    result = analyze_risk_trend([{"risk_level": "high"}])
    print(f"Single record result: {result}")
    assert result['trend'] == 'stable'
    assert "Not enough data" in result['message']

    # Improving trend
    history = [
        {"risk_level": "moderate"}, # Current
        {"risk_level": "high"},
        {"risk_level": "high"}
    ]
    result = analyze_risk_trend(history)
    print(f"Improving result: {result}")
    assert result['trend'] == 'improving'

    # Worsening trend
    history = [
        {"risk_level": "high"}, # Current
        {"risk_level": "moderate"},
        {"risk_level": "low"}
    ]
    result = analyze_risk_trend(history)
    print(f"Worsening result: {result}")
    assert result['trend'] == 'worsening'

    # Stable trend
    history = [
        {"risk_level": "high"}, # Current
        {"risk_level": "high"},
        {"risk_level": "high"}
    ]
    result = analyze_risk_trend(history)
    print(f"Stable result: {result}")
    assert result['trend'] == 'stable'

    print("✅ All RiskFlow Engine tests passed!\n")

if __name__ == "__main__":
    try:
        test_riskflow()
    except AssertionError as e:
        print(f"❌ Test failed")
        raise e
    except Exception as e:
        print(f"❌ An error occurred: {e}")
