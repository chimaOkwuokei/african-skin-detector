from datetime import date

from sqlmodel import SQLModel


class PatientCreate(SQLModel):
    name: str
    date_of_birth: date | None = None
    sex: str | None = None
    phone: str | None = None
    location: str | None = None
    teledermatology_consent: bool = False
    research_consent: bool = False
    external_ref: str | None = None
    history_notes: str | None = None


class PatientRead(SQLModel):
    id: int
    name: str
    date_of_birth: date | None
    age: int | None
    sex: str | None
    phone: str | None
    location: str | None
    teledermatology_consent: bool
    research_consent: bool
