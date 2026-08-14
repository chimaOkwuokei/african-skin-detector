from sqlmodel import SQLModel


class AIAnalysisRead(SQLModel):
    id: int
    diagnosis_text: str
    urgency_tier: str
    model_version: str


class LesionImageRead(SQLModel):
    id: int
    file_path: str
    body_site: str | None = None
