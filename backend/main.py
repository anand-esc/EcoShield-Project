from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="EcoShield Compliance Agent API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComplianceRequest(BaseModel):
    chemical_list: str
    location: str

class ComplianceResponse(BaseModel):
    hazards_identified: list[str]
    compliance_checklist: list[str]
    sources: list[str]

@app.get("/")
def read_root():
    return {"status": "EcoShield Backend is running!"}

@app.post("/api/analyze", response_model=ComplianceResponse)
async def analyze_compliance(request: ComplianceRequest):
    """
    Endpoint to process user's chemical inputs and return an Agentic RAG compliance plan.
    """
    # Basic PII Scrubbing Middleware (simulated for now)
    scrubbed_input = request.chemical_list.replace("Mr.", "[REDACTED]").replace("Mrs.", "[REDACTED]")
    
    from fastapi.concurrency import run_in_threadpool
    from agent import run_compliance_agent
    try:
        agent_result = await run_in_threadpool(run_compliance_agent, scrubbed_input, request.location)
        return ComplianceResponse(
            hazards_identified=agent_result.get("hazards", []),
            compliance_checklist=agent_result.get("checklist", []),
            sources=agent_result.get("policies", [])
        )
    except Exception as e:
        return ComplianceResponse(
            hazards_identified=["Error identifying hazards"],
            compliance_checklist=[f"Internal Server Error: {str(e)}"],
            sources=[]
        )
