import requests

url = "http://localhost:8000/api/analyze"
payload = {
    "chemical_list": "We have 500 liters of Sulfuric Acid, Zinc Sludge from our electroplating division, and lots of generic electronic e-waste.",
    "location": "Bangalore, Karnataka"
}

print("Testing Gemini 2.5 Flash Pipeline...")
res = requests.post(url, json=payload)
if res.status_code == 200:
    data = res.json()
    print("\n[HAZARDS EXTRACTED]")
    for h in data.get("hazards_identified", []):
        print("-", h)
        
    print("\n[COMPLIANCE BLUEPRINT SYNTHESIZED]")
    for c in data.get("compliance_checklist", []):
        print("-", c)
else:
    print(f"Error {res.status_code}: {res.text}")
