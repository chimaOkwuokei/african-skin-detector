from datetime import date

from app.models import Assignment, Case, Patient, User


def test_create_patient_and_case(session):
    patient = Patient(name="Jane Doe", date_of_birth=date(1990, 1, 1), sex="F")
    session.add(patient)
    session.commit()
    session.refresh(patient)

    case = Case(patient_id=patient.id, complaint="itchy mole")
    session.add(case)
    session.commit()
    session.refresh(case)

    assert case.patient_id == patient.id
    assert case.status == "submitted"  # default worked
    assert case.patient.name == "Jane Doe"  # relationship works


def test_case_requires_valid_patient_id(session):
    """Foreign key constraint should reject a bogus patient_id."""
    from sqlalchemy.exc import IntegrityError

    bad_case = Case(patient_id=9999, complaint="nonexistent patient")
    session.add(bad_case)

    import pytest

    with pytest.raises(IntegrityError):
        session.commit()


def test_assignment_is_unique_per_case(session):
    """Second Assignment for the same case should violate the unique constraint."""
    import pytest
    from sqlalchemy.exc import IntegrityError

    patient = Patient(name="Test Patient")
    session.add(patient)
    session.commit()
    session.refresh(patient)

    case = Case(patient_id=patient.id)
    specialist = User(name="Dr. Smith", role="specialist", specialty="dermatology")
    session.add_all([case, specialist])
    session.commit()
    session.refresh(case)
    session.refresh(specialist)

    session.add(Assignment(case_id=case.id, specialist_id=specialist.id))
    session.commit()

    session.add(Assignment(case_id=case.id, specialist_id=specialist.id))
    with pytest.raises(IntegrityError):
        session.commit()
