from sqlmodel import SQLModel


class UserCreate(SQLModel):
    name: str
    role: str = "specialist"  # "clinician" | "specialist" | "admin"
    specialty: str | None = None  # e.g. "dermatology"
    focus_area: str | None = None  # e.g. "hair", "eczema", "pediatric", "general"
    email: str | None = None


class UserRead(SQLModel):
    id: int
    name: str
    role: str
    specialty: str | None = None
    focus_area: str | None = None
