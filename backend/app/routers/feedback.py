from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.database import get_session
from app.models import Assignment, SpecialistFeedback
from app.schemas.feedback import SpecialistFeedbackCreate, SpecialistFeedbackRead
from app.services.feedback_service import submit_feedback

router = APIRouter(prefix="/assignments/{assignment_id}/feedback", tags=["feedback"])

# Listing across every assignment, for the clinic dashboard panel.
feed_router = APIRouter(prefix="/feedback", tags=["feedback"])


def _get_assignment_or_404(assignment_id: int, session: Session) -> Assignment:
    assignment = session.get(Assignment, assignment_id)
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.post("", response_model=SpecialistFeedbackRead)
def create_feedback(
    assignment_id: int,
    data: SpecialistFeedbackCreate,
    session: Session = Depends(get_session),
):
    assignment = _get_assignment_or_404(assignment_id, session)
    if assignment.feedback is not None:
        raise HTTPException(
            status_code=400, detail="Feedback already submitted for this assignment"
        )
    return submit_feedback(session, assignment, data)


@router.get("", response_model=SpecialistFeedbackRead)
def get_feedback(assignment_id: int, session: Session = Depends(get_session)):
    assignment = _get_assignment_or_404(assignment_id, session)
    if assignment.feedback is None:
        raise HTTPException(status_code=404, detail="No feedback for this assignment")
    return assignment.feedback


@feed_router.get("", response_model=list[SpecialistFeedbackRead])
def list_recent_feedback(
    limit: int = 10, session: Session = Depends(get_session)
):
    """Most recent specialist feedback across all cases, newest first."""
    return session.exec(
        select(SpecialistFeedback)
        .order_by(SpecialistFeedback.created_at.desc())
        .limit(limit)
    ).all()
