
import requests

BASE_URL = "http://127.0.0.1:5001/api"

def verify_admin():
    # 1. Login
    login_payload = {
        "email": "admin@automed.ai",
        "password": "admin123"
    }
    
    print(f"Logging in to {BASE_URL}/auth/login...")
    try:
        res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        if res.status_code != 200:
            print(f"Login failed: {res.status_code} {res.text}")
            return
            
        token = res.json().get('access_token')
        print("Login successful, token obtained.")
        
        # 2. Fetch Admin Predictions
        headers = {"Authorization": f"Bearer {token}"}
        print(f"Fetching admin predictions from {BASE_URL}/admin/predictions...")
        res = requests.get(f"{BASE_URL}/admin/predictions", headers=headers)
        
        if res.status_code == 200:
            data = res.json()
            print(f"Success! Found {len(data)} predictions.")
            if len(data) > 0:
                prediction = data[0]
                print("First prediction:", prediction)
                
                # 3. Try to download report
                pred_id = prediction['_id']
                print(f"Attempting to download report for {pred_id}...")
                
                report_res = requests.get(f"{BASE_URL}/predict/report/{pred_id}", headers=headers)
                print(f"Report download status: {report_res.status_code}")
                if report_res.status_code != 200:
                    print(f"Report error: {report_res.text}")
                else:
                    print(f"Report downloaded successfully. Content length: {len(report_res.content)}")
                    
        else:
            print(f"Fetch predictions failed: {res.status_code} {res.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_admin()
