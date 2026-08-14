from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

if TYPE_CHECKING:
    from app.models.clinic import Assignment, Case


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

    @property
    def case_id(self) -> int | None:
        return self.assignment.case_id if self.assignment else None

    @property
    def specialist_name(self) -> str | None:
        if self.assignment and self.assignment.specialist:
            return self.assignment.specialist.name
        return None

    @property
    def patient_name(self) -> str | None:
        if self.assignment and self.assignment.case:
            return self.assignment.case.patient_name
        return None


class CaseNote(SQLModel, table=True):
    """A free-text note a clinician adds to a case."""

    id: int | None = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="case.id")
    author_id: int | None = Field(default=None, foreign_key="user.id")
    body: str
    created_at: datetime = Field(default_factory=utcnow)

    case: Optional["Case"] = Relationship(back_populates="notes")
