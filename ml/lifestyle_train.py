print("🚀 Lifestyle (Heart Failure) script started")

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

print("📦 Libraries imported")

# Load the new dataset
# Robustly find data dir relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../data/heart_failure.csv")
df = pd.read_csv(DATA_PATH)
print("📊 Dataset loaded")
print(df.head())

# Target
X = df.drop("HeartDisease", axis=1)
y = df["HeartDisease"]

print("🧠 Features and labels separated")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("✂️ Data split done")

# Define features
categorical_features = ['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope']
numerical_features = ['Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR', 'Oldpeak']

# Create preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Create pipeline
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=150, random_state=42))
])

# Train model
print("🏋️‍♂️ Training model...")
model.fit(X_train, y_train)
print("🤖 Model trained")

# Evaluate
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print("✅ Accuracy:", acc)

# Save the entire pipeline
MODEL_PATH = os.path.join(BASE_DIR, "../models/lifestyle_model.pkl")
print(f"💾 Saving model to: {os.path.abspath(MODEL_PATH)}")
joblib.dump(model, MODEL_PATH)
# Note: We don't need a separate scaler pickle anymore because it's inside the pipeline

print("💾 Heart Failure model saved successfully as lifestyle_model.pkl")
