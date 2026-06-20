import sys
import os
from dotenv import load_dotenv

# Add the backend path so we can import agent
sys.path.append(os.path.abspath("."))
from agent import AgentTools, get_llm, get_embeddings

load_dotenv()

def test_ibm_connections():
    print("Testing LLM Connection...")
    try:
        llm = get_llm()
        res = llm.invoke("Say hello")
        print("LLM Success:", res)
    except Exception as e:
        print("LLM FAILED:", repr(e))

    print("\nTesting Embeddings Connection...")
    try:
        emb = get_embeddings()
        res = emb.embed_query("Say hello")
        print("Embeddings Success: Vector length", len(res))
    except Exception as e:
        print("Embeddings FAILED:", repr(e))

if __name__ == "__main__":
    test_ibm_connections()
