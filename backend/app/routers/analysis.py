from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.database import get_session
from app.integrations.analysis_model import MedGemmaError, MedGemmaWarmingUp
from app.models import Analysis, Case, LesionImage
from app.schemas.analysis import AIAnalysisRead
from app.services.analysis_service import run_analysis
from app.services.triage_service import (
    compute_urgency_tier,
    urgency_score,
    red_flags,
)

router = APIRouter(prefix="/cases/{case_id}/analyses", tags=["analysis"])


def _get_case_or_404(case_id: int, session: Session) -> Case:
    case = session.get(Case, case_id)
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


def _build_patient_context(case: Case) -> str:
    """
    Builds the clinical summary sent to MedGemma.

    Name, phone and location are deliberately left out: they identify the
    patient and add nothing clinically, and this goes to a third-party
    endpoint.
    """
    patient = case.patient
    lines = []

    who = []
    if patient is not None:
        if patient.age is not None:
            who.append(f"{patient.age}yo")
        if patient.sex:
            who.append(patient.sex)
    if who:
        lines.append(f"Patient: {' '.join(who)}")

    if case.complaint:
        lines.append(f"Complaint: {case.complaint}")

    if case.duration_value and case.duration_unit:
        lines.append(f"Duration: {case.duration_value} {case.duration_unit}")

    if case.onset:
        lines.append(f"Onset: {case.onset}")

    if case.symptoms:
        lines.append(f"Symptoms: {case.symptoms.replace(',', ', ')}")

    if case.body_area:
        lines.append(f"Body area: {case.body_area}")

    if case.affected_area_extent:
        lines.append(f"Extent: {case.affected_area_extent}")

    history = case.medical_history or (
        patient.history_notes if patient is not None else None
    )
    if history:
        lines.append(f"Medical history: {history}")

    if case.medication:
        lines.append(f"Current medication: {case.medication}")

    if case.allergies:
        lines.append(f"Allergies: {case.allergies}")

    if case.clinician_notes:
        lines.append(f"Clinician notes: {case.clinician_notes}")

    return "\n".join(lines) or "No patient context provided."


@router.post("", response_model=AIAnalysisRead)
async def analyze_case(case_id: int, session: Session = Depends(get_session)):
    case = _get_case_or_404(case_id, session)

    latest_image = session.exec(
        select(LesionImage)
        .where(LesionImage.case_id == case.id)
        .order_by(LesionImage.uploaded_at.desc())
    ).first()
    if latest_image is None:
        raise HTTPException(
            status_code=400, detail="Case has no uploaded lesion image to analyze"
        )

    image_bytes = Path(latest_image.file_path).read_bytes()
    patient_context = _build_patient_context(case)

    try:
        result = await run_analysis(image_bytes, patient_context)
    except MedGemmaWarmingUp as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except MedGemmaError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    flags = red_flags(case)
    analysis = Analysis(
        case_id=case.id,
        urgency_tier=compute_urgency_tier(case),
        urgency_score=urgency_score(case),
        red_flags=",".join(flags) or None,
        **result,
    )
    session.add(analysis)
    case.status = "completed"
    session.add(case)
    session.commit()
    session.refresh(analysis)
    return analysis


@router.get("", response_model=list[AIAnalysisRead])
def list_analyses(case_id: int, session: Session = Depends(get_session)):
    _get_case_or_404(case_id, session)
    return session.exec(select(Analysis).where(Analysis.case_id == case_id)).all()
