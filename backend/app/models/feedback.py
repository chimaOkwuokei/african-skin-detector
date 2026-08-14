from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

if TYPE_CHECKING:
    from app.models.clinic import Assignment


class SpecialistFeedback(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    assignment_id: int = Field(foreign_key="assignment.id", unique=True)
    final_diagnosis: str
    agreed_with_ai: bool
    notes: str | None = None
    recommended_action: str | None = None
    is_simulated: bool = Field(default=True)
    created_at: datetime = Field(default_factory=utcnow)

    assignment: Optional["Assignment"] = Relationship(back_populates="feedback")
