import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_ibm import WatsonxEmbeddings # Opt-in IBM Embeddings
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client
from dotenv import load_dotenv

load_dotenv()

def ingest_pdfs():
    """
    Reads PDFs from data/policies, splits them into semantic chunks,
    embeds them using HuggingFace (or IBM Watsonx), and
    stores them into Supabase via pgvector.
    """
    data_dir = os.path.join(os.path.dirname(__file__), "data", "policies")
    
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Created directory {data_dir}. Please place PDFs there and rerun.")
        return

    print("Loading documents...")
    loader = PyPDFDirectoryLoader(data_dir)
    docs = loader.load()

    if not docs:
        print("No documents found in the directory.")
        return

    print(f"Loaded {len(docs)} document pages.")

    print("Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    chunks = text_splitter.split_documents(docs)
    # Remove null bytes which cause PostgreSQL to crash
    for chunk in chunks:
        chunk.page_content = chunk.page_content.replace('\x00', '')
    print(f"Split into {len(chunks)} chunks.")

    # Initialize Supabase Client
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Error: Supabase URL or Service Key not found in .env")
        return

    supabase: Client = create_client(supabase_url, supabase_key)

    print("Initializing embeddings model...")
    # OPTION A: Free Local Embeddings (Default)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    table_name = "documents"
    query_name = "match_documents"

    # OPTION B: IBM Granite Embeddings (Opt-in via .env)
    # If you want to use the premium IBM models and have the API key setup:
    '''
    embeddings = WatsonxEmbeddings(
        model_id="ibm/granite-embedding-278m-multilingual",
        url=os.getenv("WATSONX_URL"),
        apikey=os.getenv("WATSONX_APIKEY"),
        project_id=os.getenv("WATSONX_PROJECT_ID")
    )
    table_name = "documents_granite"
    query_name = "match_documents_granite"
    '''

    print(f"Upserting vectors to Supabase table '{table_name}'...")
    vector_store = SupabaseVectorStore.from_documents(
        chunks,
        embeddings,
        client=supabase,
        table_name=table_name,
        query_name=query_name
    )
    
    print("Ingestion complete!")

if __name__ == "__main__":
    ingest_pdfs()
