from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

if TYPE_CHECKING:
    from app.models.clinic import Case


class Patient(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    age: int | None = None
    sex: str | None = None
    external_ref: str | None = None
    history_notes: str | None = None
    created_at: datetime = Field(default_factory=utcnow)

    cases: list["Case"] = Relationship(back_populates="patient")
