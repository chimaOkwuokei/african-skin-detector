from datetime import date

from app.models import Case, Patient
from app.routers.analysis import _build_patient_context


def _case(session, **kwargs):
    patient = Patient(
        name="Should Not Be Sent",
        date_of_birth=date(1990, 1, 1),
        sex="female",
        phone="0800 111 2222",
        location="Ibadan",
    )
    session.add(patient)
    session.commit()
    session.refresh(patient)

    case = Case(patient_id=patient.id, **kwargs)
    session.add(case)
    session.commit()
    session.refresh(case)
    return case


def test_context_includes_the_clinical_fields(session):
    case = _case(
        session,
        complaint="Itchy patch on the forearm",
        duration_value=3,
        duration_unit="weeks",
        onset="sudden",
        symptoms="Itching,Swelling",
        body_area="arms",
        affected_area_extent="few",
        medical_history="Diabetes",
        medication="Metformin",
        allergies="Penicillin",
        clinician_notes="First episode",
    )

    context = _build_patient_context(case)

    for expected in [
        "36yo female",
        "Itchy patch on the forearm",
        "3 weeks",
        "sudden",
        "Itching, Swelling",
        "arms",
        "Diabetes",
        "Metformin",
        "Penicillin",
        "First episode",
    ]:
        assert expected in context


def test_context_omits_identifying_details(session):
    """Name, phone and location must not reach the third-party model."""
    case = _case(session, complaint="Rash")

    context = _build_patient_context(case)

    assert "Should Not Be Sent" not in context
    assert "0800 111 2222" not in context
    assert "Ibadan" not in context


def test_context_skips_empty_fields(session):
    case = _case(session, complaint="Rash")

    context = _build_patient_context(case)

    assert "Duration" not in context
    assert "Allergies" not in context
