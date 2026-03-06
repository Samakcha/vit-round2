from sqlalchemy.orm import Session
from database.models import Query

def create_query(db: Session, patient_id: str, query_text: str, intent: str, ai_draft: str, spo2: int = None, bpm: int = None, status: str = "pending"):
    db_query = Query(
        patient_id=patient_id,
        query_text=query_text,
        spo2=spo2,
        bpm=bpm,
        intent=intent,
        ai_draft=ai_draft,
        status=status
    )
    db.add(db_query)
    db.commit()
    db.refresh(db_query)
    return db_query

def get_pending_queries(db: Session):
    return db.query(Query).filter(Query.status.in_(["pending", "critical_alert"])).order_by(
        Query.status.desc(), Query.id.desc() # Critical alerts first
    ).all()

def update_query_response(db: Session, query_id: int, final_response: str):
    db_query = db.query(Query).filter(Query.id == query_id).first()
    if db_query:
        db_query.final_response = final_response
        db_query.status = "reviewed"
        db.commit()
        db.refresh(db_query)
    return db_query

def get_patient_queries(db: Session, patient_id: str):
    return db.query(Query).filter(Query.patient_id == patient_id).order_by(Query.id.desc()).all()
