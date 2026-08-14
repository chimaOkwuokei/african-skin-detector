"""
Urgency scoring from the intake form. Never uses MedGemma's output.

Not a validated instrument. There is no published triage score for broad
community skin triage, so these red flags are taken from emergency
dermatology literature and cut down to the fields we collect. We don't ask
about fever, which that literature rates highly, so a low tier means "no
red flags we can see", not "not serious".
"""

from app.models.clinic import Case

# Signs of spreading infection.
_INFECTION_SIGNS = {"bleeding", "discharge"}
_INFLAMMATION_SIGNS = {"swelling"}


def _parsed_symptoms(case: Case) -> set[str]:
    if not case.symptoms:
        return set()
    return {s.strip().lower() for s in case.symptoms.split(",") if s.strip()}


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
