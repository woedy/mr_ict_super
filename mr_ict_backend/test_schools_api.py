"""
Test schools API endpoint
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_get_schools():
    print("="*60)
    print("  TEST: Get All Schools")
    print("="*60)
    
    url = f"{BASE_URL}/api/schools/get-all-schools/"
    
    print(f"\nGET {url}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nResponse:")
            print(json.dumps(data, indent=2))
            
            schools = data.get('data', {}).get('schools', [])
            print(f"\n✅ Found {len(schools)} school(s)")
            
            for school in schools:
                print(f"\n📚 School:")
                print(f"   ID: {school.get('school_id')}")
                print(f"   Name: {school.get('name')}")
                print(f"   Region: {school.get('region')}")
                print(f"   District: {school.get('district')}")
                print(f"   Email: {school.get('contact_email')}")
                print(f"   Phone: {school.get('phone')}")
            
            return True
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n🏫 Testing Schools API\n")
    success = test_get_schools()
    
    if success:
        print("\n" + "="*60)
        print("  ✅ Schools API is working correctly!")
        print("="*60)
    else:
        print("\n" + "="*60)
        print("  ❌ Schools API test failed")
        print("="*60)
