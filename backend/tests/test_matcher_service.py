from datetime import date

import pytest
from app.models import Case, Patient, User
from app.services.matcher_service import (
    SpecialistNotFoundError,
    assign_case,
    preferred_focus_area,
)


def _make_case(session, *, body_area=None, dob=None):
    patient = Patient(name="Test Patient", date_of_birth=dob)
    session.add(patient)
    session.commit()
    session.refresh(patient)

    case = Case(patient_id=patient.id, body_area=body_area)
    session.add(case)
    session.commit()
    session.refresh(case)
    return case


def test_child_prefers_pediatric(session):
    case = _make_case(session, dob=date(2018, 1, 1))
    assert preferred_focus_area(case) == "pediatric"


def test_scalp_case_prefers_hair(session):
    case = _make_case(session, body_area="scalp", dob=date(1990, 1, 1))
    assert preferred_focus_area(case) == "hair"


def test_adult_non_scalp_prefers_general(session):
    case = _make_case(session, body_area="arms", dob=date(1990, 1, 1))
    assert preferred_focus_area(case) == "general"


def test_child_takes_precedence_over_body_area(session):
    case = _make_case(session, body_area="scalp", dob=date(2018, 1, 1))
    assert preferred_focus_area(case) == "pediatric"


def test_assign_routes_scalp_case_to_hair_specialist(session):
    hair = User(name="Dr. Hair", role="specialist", focus_area="hair")
    general = User(name="Dr. General", role="specialist", focus_area="general")
    session.add_all([hair, general])
    session.commit()
    session.refresh(hair)

    case = _make_case(session, body_area="scalp", dob=date(1990, 1, 1))
    assignment = assign_case(session, case)
    assert assignment.specialist_id == hair.id


def test_falls_back_to_roster_when_no_focus_match(session):
    only = User(name="Dr. Only", role="specialist", focus_area="pigmentation")
    session.add(only)
    session.commit()
    session.refresh(only)

    case = _make_case(session, body_area="arms", dob=date(1990, 1, 1))
    assignment = assign_case(session, case)
    assert assignment.specialist_id == only.id


def test_manual_specialist_id_overrides_focus_matching(session):
    hair = User(name="Dr. Hair", role="specialist", focus_area="hair")
    eczema = User(name="Dr. Eczema", role="specialist", focus_area="eczema")
    session.add_all([hair, eczema])
    session.commit()
    session.refresh(eczema)

    case = _make_case(session, body_area="scalp", dob=date(1990, 1, 1))
    assignment = assign_case(session, case, specialist_id=eczema.id)
    assert assignment.specialist_id == eczema.id


def test_manual_assign_rejects_non_specialist(session):
    clinician = User(name="Nurse Joy", role="clinician")
    session.add(clinician)
    session.commit()
    session.refresh(clinician)

    case = _make_case(session, dob=date(1990, 1, 1))
    with pytest.raises(SpecialistNotFoundError):
        assign_case(session, case, specialist_id=clinician.id)
