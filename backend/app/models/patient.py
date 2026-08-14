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
    address: str | None = None
    phone_number: str | None = None
    share_consent: str | None = None
    research_consent: str | None = None
    created_at: datetime = Field(default_factory=utcnow)

    cases: list["Case"] = Relationship(back_populates="patient")
