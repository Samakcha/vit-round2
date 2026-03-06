from fastapi import APIRouter, Depends, HTTPException
import requests
from pydantic import BaseModel
from sqlalchemy.orm import Session
from workflows.hospital_graph import run_hospital_workflow
from database.database import get_db
from database import crud
from typing import List

router = APIRouter()

# Schemas
class QueryRequest(BaseModel):
    patient_id: str
    patient_query: str
    spo2: int | None = None
    bpm: int | None = None

class QueryResponseSchema(BaseModel):
    id: int
    patient_id: str
    query_text: str
    spo2: int | None = None
    bpm: int | None = None
    ai_draft: str | None = None
    intent: str | None = None
    final_response: str | None = None
    status: str
    
    class Config:
        from_attributes = True

class ReviewRequest(BaseModel):
    final_response: str


@router.post("/query", response_model=QueryResponseSchema)
async def handle_query(data: QueryRequest, db: Session = Depends(get_db)):
    
    # Attempt to fetch hardware vitals
    hw_spo2 = data.spo2
    hw_bpm = data.bpm
    try:
        hw_response = requests.get("http://localhost:8002/vitals", timeout=2)
        if hw_response.status_code == 200:
            vitals = hw_response.json()
            if vitals.get("spo2") is not None:
                hw_spo2 = vitals["spo2"]
            if vitals.get("heart_rate") is not None:
                hw_bpm = vitals["heart_rate"]
    except Exception as e:
        print(f"Warning: Could not fetch hardware vitals - {e}")

    # Run AI Workflow
    response = run_hospital_workflow(data.patient_query, spo2=hw_spo2, bpm=hw_bpm)
    
    intent = response.get("intent", "general").lower()
    ai_draft = response.get("draft_response", "")

    # Check for critical keywords and vitals limits
    critical_keywords = ["emergency", "heart attack", "bleeding", "unconscious", "stroke", "critical", "pain", "severe"]
    
    status = "pending"
    # Basic rule-based critical triggers:
    vital_critical = False
    if (hw_bpm and hw_bpm > 120) or (hw_spo2 and hw_spo2 < 92):
        vital_critical = True

    if vital_critical or any(keyword in data.patient_query.lower() for keyword in critical_keywords) or intent.strip() == "emergency":
        status = "critical_alert"

    # Save to Database
    db_query = crud.create_query(
        db=db,
        patient_id=data.patient_id,
        query_text=data.patient_query,
        spo2=hw_spo2,
        bpm=hw_bpm,
        intent=intent,
        ai_draft=ai_draft,
        status=status
    )
    
    return db_query

@router.get("/doctor/queries", response_model=List[QueryResponseSchema])
async def get_doctor_queries(db: Session = Depends(get_db)):
    # Fetch pending and critical_alert queries
    return crud.get_pending_queries(db)

@router.put("/doctor/queries/{query_id}/review", response_model=QueryResponseSchema)
async def review_query(query_id: int, review_data: ReviewRequest, db: Session = Depends(get_db)):
    db_query = crud.update_query_response(db, query_id=query_id, final_response=review_data.final_response)
    if not db_query:
        raise HTTPException(status_code=404, detail="Query not found")
    return db_query

@router.get("/patient/{patient_id}/queries", response_model=List[QueryResponseSchema])
async def get_patient_queries_list(patient_id: str, db: Session = Depends(get_db)):
    return crud.get_patient_queries(db, patient_id=patient_id)

@router.post("/hospital/alert")
async def trigger_hospital_alert(data: QueryRequest, db: Session = Depends(get_db)):
    # Mocking real-world alert: SMS, Email, Pager, etc.
    print(f"!!! CRITICAL ALERT SENT TO NEARBY HOSPITAL FOR PATIENT {data.patient_id} !!!")
    print(f"Reason: {data.patient_query}")
    return {"message": "Alert sent successfully to nearby hospital.", "patient_id": data.patient_id}