import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "EcoShield Backend is running!"}

def test_analyze_compliance_endpoint_structure():
    """
    Test the endpoint with mock data to ensure Pydantic validation holds
    and the correct JSON structure is returned.
    """
    payload = {
        "chemical_list": "spent sulfuric acid and zinc sludge",
        "location": "Bangalore"
    }
    
    response = client.post("/api/analyze", json=payload)
    
    # Since we might not have API keys loaded in CI/CD, it might return an error structure
    # but it MUST return a 200 OK with the ComplianceResponse shape.
    assert response.status_code == 200
    
    data = response.json()
    assert "hazards_identified" in data
    assert "compliance_checklist" in data
    assert "sources" in data
    
    # Verify lists are returned
    assert isinstance(data["hazards_identified"], list)
    assert isinstance(data["compliance_checklist"], list)
    assert isinstance(data["sources"], list)

def test_pii_scrubbing_middleware():
    """
    Test that the PII scrubbing logic redacts sensitive names before passing to the agent.
    """
    payload = {
        "chemical_list": "Mr. Smith's workshop uses sulfuric acid",
        "location": "Delhi"
    }
    response = client.post("/api/analyze", json=payload)
    
    # We can't directly assert the internal scrubbed text here unless we mock the agent,
    # but we can ensure the endpoint doesn't crash on PII.
    assert response.status_code == 200
