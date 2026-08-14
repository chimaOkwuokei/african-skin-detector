from sqlmodel import SQLModel


class SpecialistFeedbackCreate(SQLModel):
    final_diagnosis: str
    agreed_with_ai: bool
    notes: str | None = None
    recommended_action: str | None = None


class SpecialistFeedbackRead(SQLModel):
    id: int
    final_diagnosis: str
    agreed_with_ai: bool
    notes: str | None
