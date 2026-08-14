import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import get_session
from app.models import Case, CaseNote, LesionImage, Patient
from app.schemas.analysis import LesionImageRead
from app.schemas.clinic import AssignmentRead, CaseCreate, CaseRead
from app.schemas.feedback import CaseNoteCreate, CaseNoteRead
from app.services.matcher_service import (
    NoAvailableSpecialistError,
    SpecialistNotFoundError,
    assign_case,
)

router = APIRouter(prefix="/cases", tags=["cases"])


def _get_case_or_404(case_id: int, session: Session) -> Case:
    case = session.get(Case, case_id)
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("", response_model=CaseRead)
def create_case(data: CaseCreate, session: Session = Depends(get_session)):
    if session.get(Patient, data.patient_id) is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    case = Case(**data.model_dump())
    session.add(case)
    session.commit()
    session.refresh(case)
    return case


@router.get("", response_model=list[CaseRead])
def list_cases(status: str | None = None, session: Session = Depends(get_session)):
    query = select(Case)
    if status is not None:
        query = query.where(Case.status == status)
    return session.exec(query).all()


@router.get("/{case_id}", response_model=CaseRead)
def get_case(case_id: int, session: Session = Depends(get_session)):
    return _get_case_or_404(case_id, session)


@router.post("/{case_id}/images", response_model=LesionImageRead)
async def upload_lesion_image(
    case_id: int,
    file: UploadFile = File(...),
    body_site: str | None = Form(None),
    session: Session = Depends(get_session),
):
    case = _get_case_or_404(case_id, session)

    case_dir = Path(settings.upload_dir) / str(case.id)
    case_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "").suffix or ".jpg"
    dest = case_dir / f"{uuid.uuid4().hex}{suffix}"
    dest.write_bytes(await file.read())

    image = LesionImage(case_id=case.id, file_path=str(dest), body_site=body_site)
    session.add(image)
    session.commit()
    session.refresh(image)
    return image


@router.get("/{case_id}/images", response_model=list[LesionImageRead])
def list_lesion_images(case_id: int, session: Session = Depends(get_session)):
    _get_case_or_404(case_id, session)
    return session.exec(
        select(LesionImage).where(LesionImage.case_id == case_id)
    ).all()


@router.post("/{case_id}/notes", response_model=CaseNoteRead)
def add_case_note(
    case_id: int, data: CaseNoteCreate, session: Session = Depends(get_session)
):
    _get_case_or_404(case_id, session)
    note = CaseNote(case_id=case_id, **data.model_dump())
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.get("/{case_id}/notes", response_model=list[CaseNoteRead])
def list_case_notes(case_id: int, session: Session = Depends(get_session)):
    _get_case_or_404(case_id, session)
    return session.exec(select(CaseNote).where(CaseNote.case_id == case_id)).all()


@router.post("/{case_id}/assign", response_model=AssignmentRead)
def assign_case_to_specialist(
    case_id: int,
    specialist_id: int | None = None,
    session: Session = Depends(get_session),
):
    """Auto-matches a specialist, or pass ?specialist_id= to pick one."""
    case = _get_case_or_404(case_id, session)
    if case.assignment is not None:
        raise HTTPException(status_code=400, detail="Case is already assigned")

    try:
        return assign_case(session, case, specialist_id=specialist_id)
    except SpecialistNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except NoAvailableSpecialistError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.post("/{case_id}/close", response_model=CaseRead)
def close_case_without_referral(case_id: int, session: Session = Depends(get_session)):
    """Marks a case as managed locally, no referral needed."""
    case = _get_case_or_404(case_id, session)
    if case.assignment is not None:
        raise HTTPException(
            status_code=400, detail="Case already has a specialist assignment"
        )

    case.status = "managed_locally"
    session.add(case)
    session.commit()
    session.refresh(case)
    return case
