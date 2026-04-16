import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found in environment.")
    exit(1)

print(f"API Key found: {api_key[:5]}...{api_key[-5:]}")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

try:
    print("Attempting to connect to Gemini API...")
    response = model.generate_content("Say 'Hello from AutoMed AI!' if this test is successful.")
    print("\n--- GEMINI RESPONSE ---")
    print(response.text)
    print("-----------------------")
    print("Test PASSED: Gemini API is working correctly.")
except Exception as e:
    print("\nTest FAILED: Error connecting to Gemini API.")
    print(e)
