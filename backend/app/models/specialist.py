from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.clinic import Assignment


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    role: str  # "clinician" | "specialist" | "admin"
    specialty: str | None = None  # e.g. "dermatology"
    focus_area: str | None = None  # e.g. "hair", "eczema", "pediatric"
    email: str | None = None

    assignments: list["Assignment"] = Relationship(back_populates="specialist")
