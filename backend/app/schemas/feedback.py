from datetime import datetime

from sqlmodel import SQLModel


class SpecialistFeedbackCreate(SQLModel):
    final_diagnosis: str
    agreed_with_ai: bool
    notes: str | None = None
    recommended_action: str | None = None


class SpecialistFeedbackRead(SQLModel):
    id: int
    case_id: int | None
    final_diagnosis: str
    agreed_with_ai: bool
    notes: str | None
    recommended_action: str | None
    specialist_name: str | None
    patient_name: str | None
    created_at: datetime


class CaseNoteCreate(SQLModel):
    body: str
    author_id: int | None = None


class CaseNoteRead(SQLModel):
    id: int
    case_id: int
    body: str
    created_at: datetime
