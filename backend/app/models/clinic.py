from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.models._utils import utcnow

#if TYPE_CHECKING:
 #   from app.models.clinic import Case


class Clinic(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    address: str | None = None
    telephone_number: str | None = None
    created_at: datetime = Field(default_factory=utcnow)

class Case(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient.id")
    specialist_id: int = Field(foreign_key="specialist.id")
    clinic_id: int = Field(foreign_key="clinic.id")
    created_at: datetime = Field(default_factory=utcnow)

    patient: "Patient" = Relationship(back_populates="cases")
    specialist: "Specialist" = Relationship(back_populates="cases")
    clinic: "Clinic" = Relationship(back_populates="cases")