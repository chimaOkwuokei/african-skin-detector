from sqlmodel import Field, SQLModel


class ClinicCreate(SQLModel):
    name: str
    address: str | None = None
    phone_number: str | None = None


class ClinicRead(SQLModel):
    id: int
    name: str
    address: str | None = None
    phone_number: str | None = None



class CaseCreate(SQLModel):
    patient_id: int = Field(foreign_key="patient.id")
    specialist_id: int = Field(foreign_key="specialist.id")
    clinic_id: int = Field(foreign_key="clinic.id")
    main_complaint: str | None = None
    duration: int | None = None
    duration_unit: str | None = None
    onset: str | None = None
    symptoms: str | None = None
    affected_area: str | None = None
    medical_history: str | None = None
    current_medication: str | None = None
    known_allergies: str | None = None
    clinical_notes: str | None = None
    image: str | None = None


class CaseRead(SQLModel):
    id: int
    patient_id: int = Field(foreign_key="patient.id")
    specialist_id: int = Field(foreign_key="specialist.id")
    clinic_id: int = Field(foreign_key="clinic.id")
    main_complaint: str | None = None
    duration: int | None = None
    duration_unit: str | None = None
    onset: str | None = None
    symptoms: str | None = None
    affected_area: str | None = None
    medical_history: str | None = None
    current_medication: str | None = None
    known_allergies: str | None = None
    clinical_notes: str | None = None
    image: str | None = None
