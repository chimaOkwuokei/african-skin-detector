from app.models.clinic import Case
from app.services.triage_service import compute_urgency_tier


def test_discharge_with_swelling_is_tier_1():
    """Possible spreading infection."""
    case = Case(patient_id=1, symptoms="Discharge,Swelling")
    assert compute_urgency_tier(case) == "tier_1"


def test_bleeding_with_sudden_onset_is_tier_1():
    case = Case(patient_id=1, symptoms="Bleeding", onset="sudden")
    assert compute_urgency_tier(case) == "tier_1"


def test_sudden_and_widespread_is_tier_1():
    """Fast widespread rash, even without discharge."""
    case = Case(patient_id=1, symptoms="Itching", onset="sudden",
                affected_area_extent="widespread")
    assert compute_urgency_tier(case) == "tier_1"


def test_swelling_alone_is_tier_2():
    case = Case(patient_id=1, symptoms="Swelling", onset="gradual")
    assert compute_urgency_tier(case) == "tier_2"


def test_itching_alone_is_tier_3():
    case = Case(patient_id=1, symptoms="Itching", onset="gradual")
    assert compute_urgency_tier(case) == "tier_3"


def test_nothing_recorded_is_tier_2_not_tier_3():
    case = Case(patient_id=1)
    assert compute_urgency_tier(case) == "tier_2"


def test_symptom_matching_is_case_insensitive():
    case = Case(patient_id=1, symptoms="DISCHARGE, Swelling")
    assert compute_urgency_tier(case) == "tier_1"
