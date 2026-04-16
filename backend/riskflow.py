
def get_numeric_score(risk_level):
    """Convert risk level string to numeric score."""
    mapping = {
        'low': 1,
        'moderate': 2,
        'high': 3
    }
    return mapping.get(risk_level.lower(), 0)

def analyze_risk_trend(prediction_history):
    """
    Analyze risk progression from a list of historical prediction records.
    Expects history to be sorted chronologically (oldest first or newest first, 
    but we will sort it to be oldest first for logic simplicity).
    
    Format of each record in prediction_history:
    {
       "risk_level": "low | moderate | high",
       "timestamp": datetime or ISO string
    }
    """
    if not prediction_history or len(prediction_history) < 2:
        return {
            "trend": "stable",
            "message": "Not enough data to determine trend."
        }

    # Ensure chronologically sorted (oldest first)
    # Based on our integration in predict.py, we prepend "now" to the history which
    # is already sorted newest-first by the database.
    # Therefore, the input array is ALWAYS [Newest, ..., Oldest]
    # We just need to reverse it to [Oldest, ..., Newest] for the calculation.
    history = list(reversed(prediction_history))

    scores = [get_numeric_score(record.get("risk_level", "")) for record in history if get_numeric_score(record.get("risk_level", "")) > 0]

    if len(scores) < 2:
        return {
            "trend": "stable",
            "message": "Not enough valid data to determine trend."
        }

    # Compare recent score with the average of older ones
    current_score = scores[-1]
    historical_avg = sum(scores[:-1]) / len(scores[:-1])

    # Trend logic
    if current_score < historical_avg:
        trend = "improving"
        message = "Your risk trend shows improvement over recent assessments."
    elif current_score > historical_avg:
        trend = "worsening"
        message = "Your risk level has increased over time. Consider reviewing lifestyle habits."
    else:
        trend = "stable"
        message = "Your risk level has remained relatively consistent."

    return {
        "trend": trend,
        "message": message
    }
