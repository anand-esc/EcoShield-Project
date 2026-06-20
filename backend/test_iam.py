import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_iam_token():
    api_key = os.getenv("WATSONX_APIKEY")
    url = "https://iam.cloud.ibm.com/identity/token"
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": api_key
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    print("Requesting IAM token...")
    try:
        response = requests.post(url, data=data, headers=headers, timeout=10)
        print("Status Code:", response.status_code)
        print("Response:", response.text[:200])
    except Exception as e:
        print("IAM Request Failed:", repr(e))

if __name__ == "__main__":
    test_iam_token()
