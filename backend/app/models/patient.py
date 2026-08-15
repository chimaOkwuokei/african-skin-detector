from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

if TYPE_CHECKING:
    from app.models.clinic import Case


class Patient(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    date_of_birth: date | None = None
    sex: str | None = None
    phone: str | None = None
    location: str | None = None
    teledermatology_consent: bool = Field(default=False)
    research_consent: bool = Field(default=False)
    external_ref: str | None = None
    history_notes: str | None = None
    created_at: datetime = Field(default_factory=utcnow)

    cases: list["Case"] = Relationship(back_populates="patient")

    @property
    def age(self) -> int | None:
        if self.date_of_birth is None:
            return None
        today = date.today()
        had_birthday = (today.month, today.day) >= (
            self.date_of_birth.month,
            self.date_of_birth.day,
        )
        return today.year - self.date_of_birth.year - (0 if had_birthday else 1)
