import requests

BASE_URL = "http://127.0.0.1:5001/api"

def verify_publications():
    # 1. Login as Admin
    login_payload = {
        "email": "admin@automed.ai",
        "password": "admin123"
    }
    
    print("\nLogging in as Admin...")
    res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code}")
        return
    token = res.json().get('access_token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Add Publication
    pub_data = {
        "title": "A Systematic Review of AI and Machine Learning in Lifestyle Disease Risk Stratification",
        "authors": "Smith J., Doe A.",
        "description": "Comprehensive review of ML models.",
        "year": 2024,
        "link": "https://ieeexplore.ieee.org/document/11380605",
        "category": "Research Paper"
    }
    
    print("\nAdding Publication...")
    res = requests.post(f"{BASE_URL}/publications/", json=pub_data, headers=headers)
    print(f"Add Status: {res.status_code}")
    if res.status_code == 201:
        print(f"Response: {res.json()}")
        pub_id = res.json().get('id')
    else:
        print(f"Error: {res.text}")
        return

    # 3. Get All Publications (Public)
    print("\nFetching All Publications (Public)...")
    res = requests.get(f"{BASE_URL}/publications/")
    print(f"Get Status: {res.status_code}")
    pubs = res.json()
    print(f"Found {len(pubs)} publications.")
    
    if not any(p['_id'] == pub_id for p in pubs):
        print("Error: Recently added publication not found!")
    
    # 4. Update Publication
    print("\nUpdating Publication...")
    update_data = {"description": "Updated description."}
    res = requests.put(f"{BASE_URL}/publications/{pub_id}", json=update_data, headers=headers)
    print(f"Update Status: {res.status_code}")
    
    # 5. Delete Publication
    # We will keep it for now to verify frontend, actually let's not delete it so we have data.
    # But let's verify delete works by creating a dummy one.
    
    print("\nTesting Delete with Dummy...")
    dummy_res = requests.post(f"{BASE_URL}/publications/", json=pub_data, headers=headers)
    dummy_id = dummy_res.json().get('id')
    
    del_res = requests.delete(f"{BASE_URL}/publications/{dummy_id}", headers=headers)
    print(f"Delete Status: {del_res.status_code}")

if __name__ == "__main__":
    verify_publications()
