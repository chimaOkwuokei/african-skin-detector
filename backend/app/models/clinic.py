from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

if TYPE_CHECKING:
    from app.models.analysis import Analysis, LesionImage
    from app.models.feedback import SpecialistFeedback
    from app.models.patient import Patient
    from app.models.specialist import User


class Case(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    patient_id: int = Field(foreign_key="patient.id")
    submitted_by: int | None = Field(default=None, foreign_key="user.id")

    complaint: str | None = None
    duration_value: int | None = None
    duration_unit: str | None = None  # "hours" | "days" | "weeks" | "months" | "years"
    onset: str | None = None  # "sudden" | "gradual" | "unknown"
    symptoms: str | None = None  # comma-separated, e.g. "itching,scaling"
    body_area: str | None = None
    affected_area_extent: str | None = None  # "one" | "few" | "many" | "widespread"
    medical_history: str | None = None
    medication: str | None = None
    allergies: str | None = None
    clinician_notes: str | None = None

    status: str = Field(default="submitted")
    # submitted -> processing -> completed -> assigned -> in_review -> reviewed
    # no referral needed: completed -> managed_locally

    created_at: datetime = Field(default_factory=utcnow)

    patient: Optional["Patient"] = Relationship(back_populates="cases")
    images: list["LesionImage"] = Relationship(back_populates="case")
    analyses: list["Analysis"] = Relationship(back_populates="case")
    assignment: Optional["Assignment"] = Relationship(back_populates="case")

    @property
    def assignment_status(self) -> str | None:
        return self.assignment.status if self.assignment else None

    @property
    def specialist_name(self) -> str | None:
        if self.assignment and self.assignment.specialist:
            return self.assignment.specialist.name
        return None


class Assignment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="case.id", unique=True)
    specialist_id: int = Field(foreign_key="user.id")
    status: str = Field(default="pending")  # pending -> reviewed
    assigned_at: datetime = Field(default_factory=utcnow)

    case: Optional["Case"] = Relationship(back_populates="assignment")
    specialist: Optional["User"] = Relationship(back_populates="assignments")
    feedback: Optional["SpecialistFeedback"] = Relationship(back_populates="assignment")

    @property
    def specialist_name(self) -> str | None:
        return self.specialist.name if self.specialist else None
