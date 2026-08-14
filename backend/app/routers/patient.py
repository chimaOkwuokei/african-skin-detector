from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.database import get_session
from app.models import Case, Patient
from app.schemas.clinic import CaseRead
from app.schemas.patient import PatientCreate, PatientRead

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("", response_model=PatientRead)
def create_patient(data: PatientCreate, session: Session = Depends(get_session)):
    patient = Patient(**data.model_dump())
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient


@router.get("", response_model=list[PatientRead])
def list_patients(session: Session = Depends(get_session)):
    return session.exec(select(Patient)).all()


@router.get("/{patient_id}", response_model=PatientRead)
def get_patient(patient_id: int, session: Session = Depends(get_session)):
    patient = session.get(Patient, patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/{patient_id}/cases", response_model=list[CaseRead])
def list_patient_cases(patient_id: int, session: Session = Depends(get_session)):
    """Case history for the patient profile page."""
    if session.get(Patient, patient_id) is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return session.exec(select(Case).where(Case.patient_id == patient_id)).all()
