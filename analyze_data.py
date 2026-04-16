import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data/heart_failure.csv")

try:
    df = pd.read_csv(DATA_PATH)
    print("Dataset Loaded.")
    
    print("\n--- Correlations with HeartDisease ---")
    correlations = df.corr(numeric_only=True)["HeartDisease"].sort_values(ascending=False)
    print(correlations)
    
    print("\n--- MaxHR Statistics ---")
    print(df.groupby("HeartDisease")["MaxHR"].describe())
    
    print("\n--- Age Statistics ---")
    print(df.groupby("HeartDisease")["Age"].describe())

except Exception as e:
    print(e)
