# AI and Machine Learning in Lifestyle Disease Risk Stratification

Final Year Capstone Project.

## Project Objective
A full-stack web application that uses trained Machine Learning models to predict Diabetes and Lifestyle/Heart disease risk.

## Tech Stack
- **Frontend**: React (Vite), CSS3 (Dark Theme), Axios.
- **Backend**: Python Flask, PyMongo, Flask-JWT-Extended.
- **Database**: MongoDB.
- **ML**: Scikit-Learn (RandomForest).

## Setup Instructions

### 1. Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB (Running locally on port 27017)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- **User Auth**: Secure login/registration.
- **AI Prediction**: Real-time risk assessment.
- **History**: Track past predictions.
- **PDF Reports**: Downloadable assessment reports.
- **Admin Panel**: User management and system statistics.

## Project Structure
- `/backend`: Flask API & ML Logic.
- `/frontend`: React UI.
- `/models`: Pre-trained .pkl models.
- `/data`: Training datasets.
