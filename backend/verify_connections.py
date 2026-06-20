import os
from dotenv import load_dotenv
from supabase.client import Client, create_client
from langchain_ibm import WatsonxLLM
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

def test_supabase():
    print("\n--- 1. Testing Supabase Connection ---")
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    try:
        supabase: Client = create_client(url, key)
        # Attempt to fetch 1 row from documents to prove read access
        response = supabase.table("documents").select("id").limit(1).execute()
        print("✅ SUCCESS: Connected to Supabase!")
        print(f"✅ Found data in 'documents' table? {'Yes' if len(response.data) > 0 else 'No (Table is empty)'}")
    except Exception as e:
        print(f"❌ FAILED: Supabase connection error: {e}")

def test_watsonx():
    print("\n--- 2. Testing IBM Watsonx (Granite LLM) Connection ---")
    api_key = os.getenv("WATSONX_APIKEY")
    project_id = os.getenv("WATSONX_PROJECT_ID")
    url = os.getenv("WATSONX_URL")
    try:
        llm = WatsonxLLM(
            model_id="ibm/granite-3-1-8b-base",
            url=url,
            apikey=api_key,
            project_id=project_id,
            params={"max_new_tokens": 10}
        )
        result = llm.invoke("Say the word 'Hello'")
        print("✅ SUCCESS: Connected to IBM Watsonx!")
        print(f"✅ Response from Granite 3.1 8B Base: {result.strip()}")
    except Exception as e:
        print(f"❌ FAILED: Watsonx connection error: {e}")

def test_embeddings():
    print("\n--- 3. Testing Local Embeddings (PyTorch) ---")
    try:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vector = embeddings.embed_query("Test chemical")
        print(f"✅ SUCCESS: Loaded HuggingFace model locally!")
        print(f"✅ Generated vector of size {len(vector)}")
    except Exception as e:
        print(f"❌ FAILED: Local embeddings error: {e}")

if __name__ == "__main__":
    print("Starting System Diagnostics...")
    test_supabase()
    test_watsonx()
    test_embeddings()
    print("\nDiagnostics Complete.")
