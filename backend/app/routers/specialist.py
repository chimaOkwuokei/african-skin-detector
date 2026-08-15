from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.database import get_session
from app.models import Assignment, User
from app.schemas.clinic import AssignmentRead
from app.schemas.specialist import UserCreate, UserRead



router = APIRouter(prefix="/specialists", tags=["specialists"])


@router.post("", response_model=UserRead)
def create_specialist(data: UserCreate, session: Session = Depends(get_session)):
    user = User(**data.model_dump())
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("", response_model=list[UserRead])
def list_specialists(
    role: str | None = "specialist",
    focus_area: str | None = None,
    session: Session = Depends(get_session),
):
    """Pass role=None (or ?role=) to list every user regardless of role."""
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if focus_area:
        query = query.where(User.focus_area == focus_area)
    return session.exec(query).all()


@router.get(
    "/{user_id}/assignments",
    response_model=list[AssignmentRead],
)
def list_specialist_assignments(
    user_id: int,
    session: Session = Depends(get_session),
):
    """Return all assignments belonging to one specialist."""

    specialist = session.get(User, user_id)

    if specialist is None:
        raise HTTPException(
            status_code=404,
            detail="Specialist not found",
        )

    if specialist.role != "specialist":
        raise HTTPException(
            status_code=400,
            detail="User is not a specialist",
        )

    assignments = session.exec(
        select(Assignment).where(
            Assignment.specialist_id == user_id
        )
        ).all()

    return assignments

@router.get("/{user_id}", response_model=UserRead)
def get_specialist(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

