from app.services.analysis_service import extract_primary_diagnosis


def test_extract_primary_diagnosis_from_real_sample():
    """Pinned against a real MedGemma response, so this catches drift in
    the prompt or the model's output format."""
    sample = (
        "I observe a raised, firm-appearing, dark brown lesion on the "
        "patient's earlobe. There are also smaller, similar-appearing "
        "raised lesions visible on the upper part of the ear helix. "
        "The larger lesion on the earlobe is nodular and has a somewhat "
        "irregular surface. The smaller lesions on the helix are also "
        "nodular. The patient reports the lesion has been present for "
        "6 months.\n"
        "Based on the appearance and location (earlobe, a common site "
        "for piercings), the most likely assessment is a keloid scar. "
        "Keloids are overgrown scars that form after an injury, such as "
        "an ear piercing, and are more common in individuals with darker "
        "skin tones. They are typically firm, raised, and can be itchy "
        "or tender.\n"
        "PRIMARY_DIAGNOSIS: Keloid"
    )

    assert extract_primary_diagnosis(sample) == "Keloid"


def test_extract_primary_diagnosis_falls_back_when_missing():
    """If the model ignores the format instruction, show a placeholder
    instead of crashing."""
    sample = "This looks concerning but I won't follow your formatting rules."

    result = extract_primary_diagnosis(sample)
    assert result == "unspecified, see full assessment"


def test_extract_primary_diagnosis_is_case_insensitive():
    """Model output casing varies between runs."""
    sample = "Some assessment text.\nprimary_diagnosis: Actinic keratosis"

    assert extract_primary_diagnosis(sample) == "Actinic keratosis"
