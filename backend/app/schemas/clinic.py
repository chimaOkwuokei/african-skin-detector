from datetime import datetime

from sqlmodel import SQLModel


class CaseCreate(SQLModel):
    patient_id: int
    submitted_by: int | None = None
    complaint: str | None = None
    duration_value: int | None = None
    duration_unit: str | None = None
    onset: str | None = None
    symptoms: str | None = None
    body_area: str | None = None
    affected_area_extent: str | None = None
    medical_history: str | None = None
    medication: str | None = None
    allergies: str | None = None
    clinician_notes: str | None = None


class CaseRead(SQLModel):
    id: int
    patient_id: int
    complaint: str | None
    duration_value: int | None
    duration_unit: str | None
    onset: str | None
    symptoms: str | None
    body_area: str | None
    affected_area_extent: str | None
    medical_history: str | None
    medication: str | None
    allergies: str | None
    clinician_notes: str | None
    status: str
    created_at: datetime
    assignment_status: str | None
    specialist_name: str | None
    patient_name: str | None
    patient_ref: str | None
    urgency_tier: str | None
    urgency_score: int | None
    diagnosis_text: str | None


class AssignmentRead(SQLModel):
    id: int
    case_id: int
    specialist_id: int
    specialist_name: str | None
    status: str
