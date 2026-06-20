import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_endpoints():
    print("Getting IAM token...", flush=True)
    api_key = os.getenv("WATSONX_APIKEY")
    token_url = "https://iam.cloud.ibm.com/identity/token"
    token_data = {"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": api_key}
    token_res = requests.post(token_url, data=token_data, headers={"Content-Type": "application/x-www-form-urlencoded"}, timeout=10)
    token = token_res.json()["access_token"]
    print("Got IAM token.", flush=True)

    project_id = os.getenv("WATSONX_PROJECT_ID")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    print("\nTesting LLM endpoint...", flush=True)
    llm_url = "https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
    llm_payload = {
        "model_id": "meta-llama/llama-3-3-70b-instruct",
        "input": "Hello",
        "parameters": {"max_new_tokens": 10},
        "project_id": project_id
    }
    try:
        res = requests.post(llm_url, json=llm_payload, headers=headers, timeout=10)
        print("LLM Status Code:", res.status_code, flush=True)
        print("LLM Response:", res.text[:200], flush=True)
    except Exception as e:
        print("LLM FAILED:", repr(e), flush=True)

    print("\nTesting Embeddings endpoint...", flush=True)
    emb_url = "https://eu-de.ml.cloud.ibm.com/ml/v1/text/embeddings?version=2023-05-29"
    emb_payload = {
        "model_id": "ibm/granite-embedding-278m-multilingual",
        "inputs": ["Hello world"],
        "project_id": project_id
    }
    try:
        res = requests.post(emb_url, json=emb_payload, headers=headers, timeout=10)
        print("Embeddings Status Code:", res.status_code, flush=True)
        print("Embeddings Response:", res.text[:200], flush=True)
    except Exception as e:
        print("Embeddings FAILED:", repr(e), flush=True)

if __name__ == "__main__":
    test_endpoints()
