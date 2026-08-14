from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

if TYPE_CHECKING:
    from app.models.clinic import Case


class LesionImage(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="case.id")
    file_path: str
    body_site: str | None = None
    uploaded_at: datetime = Field(default_factory=utcnow)

    case: Optional["Case"] = Relationship(back_populates="images")


class Analysis(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="case.id")
    model_version: str = Field(default="medgemma-4b")

    diagnosis_text: str  # MedGemma's predicted diagnosis
    # "tier_1" (most urgent) | "tier_2" | "tier_3" | "unassigned"
    urgency_tier: str = "unassigned"
    raw_output: str | None = None

    created_at: datetime = Field(default_factory=utcnow)

    case: Optional["Case"] = Relationship(back_populates="analyses")
