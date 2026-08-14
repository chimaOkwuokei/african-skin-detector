from app.models.clinic import Case
from app.services.triage_service import (
    compute_urgency_tier,
    red_flags,
    urgency_score,
)


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


def test_red_flags_are_listed_for_display():
    case = Case(patient_id=1, symptoms="Discharge,Swelling", onset="sudden")
    assert red_flags(case) == [
        "Bleeding or discharge",
        "Swelling",
        "Came on suddenly",
    ]


def test_score_bands_never_contradict_the_tier():
    """Any High case scores above any Moderate, and Moderate above Low."""
    high = Case(patient_id=1, symptoms="Discharge,Swelling")
    moderate = Case(patient_id=1, symptoms="Swelling")
    low = Case(patient_id=1, symptoms="Itching")

    assert urgency_score(high) > urgency_score(moderate) > urgency_score(low)


def test_score_rises_with_flag_count_inside_the_high_band():
    two = Case(patient_id=1, symptoms="Discharge,Swelling")
    three = Case(patient_id=1, symptoms="Discharge,Swelling", onset="sudden")
    four = Case(
        patient_id=1,
        symptoms="Discharge,Swelling",
        onset="sudden",
        affected_area_extent="widespread",
    )

    assert urgency_score(two) == 70
    assert urgency_score(three) == 85
    assert urgency_score(four) == 100


def test_equal_flag_counts_in_different_tiers_score_differently():
    """Two flags each, but only one is the infection pattern."""
    infection = Case(patient_id=1, symptoms="Discharge,Swelling")
    not_infection = Case(patient_id=1, symptoms="Swelling", onset="sudden")

    assert compute_urgency_tier(infection) == "tier_1"
    assert compute_urgency_tier(not_infection) == "tier_2"
    assert urgency_score(infection) > urgency_score(not_infection)


def test_nothing_recorded_scores_below_a_single_flag():
    nothing = Case(patient_id=1)
    one_flag = Case(patient_id=1, symptoms="Swelling")

    assert urgency_score(nothing) == 40
    assert urgency_score(one_flag) == 55
