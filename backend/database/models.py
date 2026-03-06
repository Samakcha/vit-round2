from sqlalchemy import Column, Integer, String, Text
from database.database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    query_text = Column(Text, nullable=False)
    spo2 = Column(Integer, nullable=True)
    bpm = Column(Integer, nullable=True)
    ai_draft = Column(Text)
    intent = Column(String)
    final_response = Column(Text)
    status = Column(String, default="pending") # pending, reviewed, critical_alert
