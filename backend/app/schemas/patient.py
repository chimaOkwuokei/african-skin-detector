from sqlmodel import SQLModel


class PatientCreate(SQLModel):
    name: str
    age: int | None = None
    sex: str | None = None
    address: str | None = None
    phone_number: str | None = None
    image: str | None = None
    share_consent: str | None = None
    research_consent: str | None = None


class PatientRead(SQLModel):
    id: int
    name: str
    age: int | None
    sex: str | None
    address: str | None = None
    phone_number: str | None = None
    image: str | None = None
    share_consent: str | None = None
    research_consent: str | None = None

