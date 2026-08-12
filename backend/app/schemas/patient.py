from sqlmodel import SQLModel


class PatientCreate(SQLModel):
    name: str
    age: int | None = None
    sex: str | None = None
    external_ref: str | None = None
    history_notes: str | None = None


class PatientRead(SQLModel):
    id: int
    name: str
    age: int | None
    sex: str | None
