import os
from dotenv import load_dotenv
from langchain_ibm import WatsonxLLM

load_dotenv()

api_key = os.getenv("WATSONX_APIKEY")
project_id = os.getenv("WATSONX_PROJECT_ID")
url = os.getenv("WATSONX_URL")

try:
    print(f"Testing Watsonx connection to {url} with project {project_id}...")
    llm = WatsonxLLM(
        model_id="ibm/granite-13b-chat-v2",
        url=url,
        apikey=api_key,
        project_id=project_id,
        params={
            "decoding_method": "greedy",
            "max_new_tokens": 50,
            "min_new_tokens": 1
        }
    )
    result = llm.invoke("Say the word 'success' if you receive this message.")
    print("Response from IBM Granite:", result)
except Exception as e:
    import traceback
    traceback.print_exc()
