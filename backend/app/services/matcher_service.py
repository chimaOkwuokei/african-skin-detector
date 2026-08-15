"""
Routes a case to a specialist.

Specialists can have any focus_area, but only these are matched
automatically:

  patient under 18        -> "pediatric"
  body_area scalp/hair    -> "hair"
  everything else         -> "general"

We can't tell eczema from psoriasis from a fungal infection, so those
focus areas are only reachable by passing specialist_id to the assign
endpoint. Urgency doesn't affect routing: it decides how fast a case is
seen, not which specialist sees it.

Within a matched group the least busy specialist wins. If nobody matches,
it falls back to the whole roster.
"""

from sqlalchemy import func
from sqlmodel import Session, select

from app.models import Assignment, Case, User

_HAIR_BODY_AREAS = {"scalp", "hair"}
_CHILD_MAX_AGE = 18


class NoAvailableSpecialistError(Exception):
    """Raised when there are no specialist users to assign a case to."""


class SpecialistNotFoundError(Exception):
    """Raised when a requested specialist_id isn't a specialist."""


def preferred_focus_area(case: Case) -> str:
    """The focus_area this case should go to."""
    patient = case.patient
    if patient is not None and patient.age is not None and patient.age < _CHILD_MAX_AGE:
        return "pediatric"
    if (case.body_area or "").strip().lower() in _HAIR_BODY_AREAS:
        return "hair"
    return "general"


def _load_by_specialist(session: Session) -> dict[int, int]:
    rows = session.exec(
        select(Assignment.specialist_id, func.count(Assignment.id))
        .where(Assignment.status == "pending")
        .group_by(Assignment.specialist_id)
    ).all()
    return dict(rows)


def _commit_assignment(session: Session, case: Case, specialist: User) -> Assignment:
    assignment = Assignment(case_id=case.id, specialist_id=specialist.id)
    session.add(assignment)
    case.status = "assigned"
    session.add(case)
    session.commit()
    session.refresh(assignment)
    return assignment


def assign_case(
    session: Session, case: Case, specialist_id: int | None = None
) -> Assignment:
    """Assigns the case. Pass specialist_id to skip focus matching."""
    if specialist_id is not None:
        specialist = session.get(User, specialist_id)
        if specialist is None or specialist.role != "specialist":
            raise SpecialistNotFoundError(
                f"No specialist with id {specialist_id}."
            )
        return _commit_assignment(session, case, specialist)

    specialists = session.exec(select(User).where(User.role == "specialist")).all()
    if not specialists:
        raise NoAvailableSpecialistError("No specialist users available to assign.")

    wanted = preferred_focus_area(case)
    matching = [
        s for s in specialists if (s.focus_area or "").strip().lower() == wanted
    ]
    candidates = matching or specialists

    load = _load_by_specialist(session)
    chosen = min(candidates, key=lambda s: load.get(s.id, 0))
    return _commit_assignment(session, case, chosen)
