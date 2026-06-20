import os
import functools
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from supabase.client import Client, create_client
from dotenv import load_dotenv

load_dotenv()

# Global Singletons
GLOBAL_LLM = None
GLOBAL_EMBEDDINGS = None
GLOBAL_SUPABASE = None

def get_supabase_client():
    global GLOBAL_SUPABASE
    if GLOBAL_SUPABASE is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        if supabase_url and supabase_key:
            GLOBAL_SUPABASE = create_client(supabase_url, supabase_key)
    return GLOBAL_SUPABASE

def get_llm():
    global GLOBAL_LLM
    if GLOBAL_LLM is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            GLOBAL_LLM = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=api_key,
                temperature=0.2,
                max_output_tokens=1500
            )
    return GLOBAL_LLM

def get_embeddings():
    global GLOBAL_EMBEDDINGS
    if GLOBAL_EMBEDDINGS is None:
        # We are using local HuggingFace embeddings for speed and no API limits
        # If you want to use IBM Watsonx for embeddings, update this function.
        GLOBAL_EMBEDDINGS = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return GLOBAL_EMBEDDINGS

class AgentTools:
    @staticmethod
    def extract_hazards(chemical_input: str) -> list[str]:
        llm = get_llm()
        if not llm:
            return ["Sulfuric Acid", "Zinc Sludge"]
            
        prompt = PromptTemplate.from_template(
            "You are an AI hazard identifier. Extract the hazardous chemicals or waste materials from this text: '{input}'.\n"
            "Return ONLY a comma-separated list of the materials. No intro, no outro."
        )
        response = llm.invoke(prompt.format(input=chemical_input))
        # Gemini returns an AIMessage, so we access .content
        content = response.content if hasattr(response, 'content') else response
        return [h.strip() for h in content.split(",") if h.strip()]

    @staticmethod
    def formulate_query(hazards: list[str], location: str) -> str:
        llm = get_llm()
        if not llm:
            return f"environmental laws for {' '.join(hazards)} in {location}"
            
        prompt = PromptTemplate.from_template(
            "You are an expert legal researcher. We need to search a vector database for laws regarding these materials: {hazards} in the location: {location}.\n"
            "Formulate a single, highly effective semantic search query (a question) to retrieve the relevant disposal and compliance regulations.\n"
            "Return ONLY the query string, nothing else."
        )
        response = llm.invoke(prompt.format(hazards=", ".join(hazards), location=location))
        content = response.content if hasattr(response, 'content') else response
        return content.strip().strip('"').strip("'")

    @staticmethod
    def retrieve_documents(query: str) -> list[str]:
        supabase = get_supabase_client()
        if not supabase:
             return ["Error: Supabase credentials missing"]
             
        embeddings = get_embeddings()
        vector_store = SupabaseVectorStore(
             client=supabase,
             embedding=embeddings,
             table_name="documents", # using the 384d table
             query_name="match_documents"
        )
        
        # Increased k to 8 for deeper context retrieval
        docs = vector_store.similarity_search(query, k=8)
        if not docs:
             return ["No specific regional policies found for these materials."]
             
        return [doc.page_content for doc in docs]

    @staticmethod
    def synthesize_checklist(hazards: list[str], location: str, docs: list[str]) -> list[str]:
        llm = get_llm()
        if not llm:
            return [f"Mock Rule 1 for {hazards[0]}", f"Mock Rule 2 for {hazards[0]}"]
            
        context = "\n\n---\n\n".join(docs)
        prompt = PromptTemplate.from_template(
            "You are an elite Environmental Compliance Lawyer in India.\n"
            "Location: {location}\n"
            "Hazards: {hazards}\n\n"
            "LEGAL CONTEXT:\n{context}\n\n"
            "TASK: Based strictly on the provided legal context, generate a strict step-by-step compliance action plan for handling and disposing of these specific hazards.\n"
            "FORMAT: Output ONLY a JSON array of strings, where each string is a checklist item. Ensure it is valid JSON. E.g. [\"Step 1...\", \"Step 2...\"]"
        )
        response = llm.invoke(prompt.format(
            location=location, 
            hazards=", ".join(hazards), 
            context=context
        ))
        
        content = response.content if hasattr(response, 'content') else response
        
        # Clean the response to ensure valid JSON
        try:
            # Strip markdown code blocks if Gemini returned them
            clean_content = content.replace("```json", "").replace("```", "").strip()
            
            json_str = clean_content[clean_content.find("["):clean_content.rfind("]")+1]
            checklist = json.loads(json_str)
            return checklist if isinstance(checklist, list) else ["Error parsing checklist format."]
        except Exception as e:
            print("Failed to parse LLM JSON response:", content)
            return [line.strip().lstrip("-*1234567890. ") for line in content.split("\n") if line.strip() and len(line) > 10]

@functools.lru_cache(maxsize=128)
def run_compliance_agent(chemical_list: str, location: str):
    """
    The True Agentic Synthesis Loop using Gemini 2.5 Flash for reasoning.
    """
    # Step 1: Extract Hazards
    hazards = AgentTools.extract_hazards(chemical_list)
    
    # Step 2: Formulate Smart Search Query
    search_query = AgentTools.formulate_query(hazards, location)
    print(f"Generated Search Query: {search_query}")
    
    # Step 3: Retrieve Legal Context (Deep Search)
    docs = AgentTools.retrieve_documents(search_query)
    
    # Step 4: Synthesize Final Blueprint
    checklist = AgentTools.synthesize_checklist(hazards, location, docs)
    
    # Extract rough sources for citation
    sources = [f"Regulatory Document snippet {i+1}" for i in range(min(3, len(docs)))]
    
    return {
        "hazards": hazards,
        "policies": docs[:2], # returning first 2 just for debug payload if needed
        "checklist": checklist,
        "sources": sources
    }
