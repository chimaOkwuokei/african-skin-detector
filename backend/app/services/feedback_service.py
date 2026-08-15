from sqlmodel import Session

from app.models import Assignment, SpecialistFeedback
from app.schemas.feedback import SpecialistFeedbackCreate


def submit_feedback(
    session: Session, assignment: Assignment, data: SpecialistFeedbackCreate
) -> SpecialistFeedback:
    """Records a specialist's review of an assignment and marks it reviewed."""
    feedback = SpecialistFeedback(assignment_id=assignment.id, **data.model_dump())
    session.add(feedback)
    assignment.status = "reviewed"
    session.add(assignment)
    session.commit()
    session.refresh(feedback)
    return feedback
