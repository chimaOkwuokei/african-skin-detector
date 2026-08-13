from sqlmodel import SQLModel


class SpecialistCreate(SQLModel):
    name: str
    sex: str | None = None
    address: str | None = None
    phone_number: str | None = None


class SpecialistRead(SQLModel):
    id: int
    name: str
    sex: str | None
    address: str | None = None
    phone_number: str | None = None
   
