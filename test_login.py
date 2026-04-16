
import requests
import sys

URL = "http://localhost:5001/api/auth/login"
# Use a known test user or try to register one first if this fails?
# Let's try to register a temp user first to be sure.
REGISTER_URL = "http://localhost:5001/api/auth/register"

user_data = {
    "username": "test_monitor_user",
    "email": "monitor@test.com",
    "password": "password123"
}

try:
    print(f"Attempting to register user at {REGISTER_URL}...")
    reg_res = requests.post(REGISTER_URL, json=user_data, timeout=5)
    print(f"Register Status: {reg_res.status_code}")
    print(f"Register Response: {reg_res.text}")
    
    print(f"\nAttempting to login user at {URL}...")
    login_res = requests.post(URL, json={"email": "monitor@test.com", "password": "password123"}, timeout=5)
    print(f"Login Status: {login_res.status_code}")
    print(f"Login Response: {login_res.text}")
    
    if login_res.status_code == 200:
        print("✅ Login Successful from script")
    else:
        print("❌ Login Failed from script")

except Exception as e:
    print(f"❌ Connection Error: {e}")
