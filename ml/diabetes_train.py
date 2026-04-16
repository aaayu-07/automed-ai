print("🚀 Script started")

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

print("📦 Libraries imported")

# Load dataset
df = pd.read_csv("../data/diabetes.csv")
print("📊 Dataset loaded")
print(df.head())

# Replace invalid zeros
cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
df[cols] = df[cols].replace(0, df[cols].median())

# Features & target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

print("🧠 Features and labels separated")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("✂️ Data split done")

# Scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

print("📐 Scaling done")

# Model training
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("🤖 Model trained")

# Evaluation
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print("✅ Accuracy:", acc)

# Save model
joblib.dump(model, "../models/diabetes_model.pkl")
joblib.dump(scaler, "../models/diabetes_scaler.pkl")

print("💾 Model & scaler saved successfully")
