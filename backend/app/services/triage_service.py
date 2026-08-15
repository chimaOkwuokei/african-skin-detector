"""
Urgency scoring from the intake form. Never uses MedGemma's output.

Not a validated instrument. There is no published triage score for broad
community skin triage, so these red flags are taken from emergency
dermatology literature and cut down to the fields we collect. We don't ask
about fever, which that literature rates highly, so a low tier means "no
red flags we can see", not "not serious".

The score is a display number derived from the tier and the number of red
flags, banded so it can never contradict the tier: High scores 70-100,
Moderate 40-55, Low 10. It is not a probability. A 85 does not mean "85%
likely to be serious", it means High with three of four flags recorded.
"""

from app.models.clinic import Case

# Signs of spreading infection.
_INFECTION_SIGNS = {"bleeding", "discharge"}
_INFLAMMATION_SIGNS = {"swelling"}


def _parsed_symptoms(case: Case) -> set[str]:
    if not case.symptoms:
        return set()
    return {s.strip().lower() for s in case.symptoms.split(",") if s.strip()}


def red_flags(case: Case) -> list[str]:
    """The red flags present on this case, in plain wording for the UI."""
    symptoms = _parsed_symptoms(case)
    found = []

    if symptoms & _INFECTION_SIGNS:
        found.append("Bleeding or discharge")
    if symptoms & _INFLAMMATION_SIGNS:
        found.append("Swelling")
    if case.onset == "sudden":
        found.append("Came on suddenly")
    if case.affected_area_extent == "widespread":
        found.append("Widespread")

    return found


# Score bands per tier. Kept apart so a High case always outranks a
# Moderate one, whatever the flag count.
_HIGH_BY_FLAG_COUNT = {2: 70, 3: 85, 4: 100}
_MODERATE_ONE_FLAG = 55
_MODERATE_NO_DATA = 40
_LOW = 10


def urgency_score(case: Case) -> int:
    """A 0-100 display number that always agrees with the tier."""
    tier = compute_urgency_tier(case)
    count = len(red_flags(case))

    if tier == "tier_1":
        return _HIGH_BY_FLAG_COUNT.get(count, 70)
    if tier == "tier_2":
        return _MODERATE_ONE_FLAG if count else _MODERATE_NO_DATA
    return _LOW


def compute_urgency_tier(case: Case) -> str:
    """Returns "tier_1" (High) | "tier_2" (Moderate) | "tier_3" (Low)."""
    symptoms = _parsed_symptoms(case)

    if not symptoms and not case.onset and not case.affected_area_extent:
        # Nothing recorded. No data is not the same as no risk.
        return "tier_2"

    infection = bool(symptoms & _INFECTION_SIGNS)
    inflammation = bool(symptoms & _INFLAMMATION_SIGNS)
    spreading_fast = case.onset == "sudden"
    extensive = case.affected_area_extent == "widespread"

    # Possible spreading infection, or a fast widespread rash.
    if (infection and (inflammation or spreading_fast or extensive)) or (
        spreading_fast and extensive
    ):
        return "tier_1"

    if infection or inflammation or spreading_fast or extensive:
        return "tier_2"

    return "tier_3"
