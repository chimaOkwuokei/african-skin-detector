import re

from app.integrations.analysis_model import analyze_lesion_image

# Matches a line like "PRIMARY_DIAGNOSIS: keloid scar"
_DIAGNOSIS_LINE = re.compile(
    r"^PRIMARY_DIAGNOSIS:\s*(.+)$", re.MULTILINE | re.IGNORECASE
)


def extract_primary_diagnosis(raw_text: str) -> str:
    """
    Pulls the structured PRIMARY_DIAGNOSIS line out of MedGemma's response.
    Falls back to a generic placeholder if the model didn't follow the
    format, which should be rare.
    """
    match = _DIAGNOSIS_LINE.search(raw_text)
    if match:
        return match.group(1).strip().rstrip(".")
    return "unspecified, see full assessment"


async def run_analysis(image_bytes: bytes, patient_context: str) -> dict:
    """
    Orchestrates a full MedGemma analysis: calls the model and extracts the
    structured diagnosis.

    Raises MedGemmaError / MedGemmaWarmingUp if the call itself fails
    """
    raw_output = await analyze_lesion_image(image_bytes, patient_context)
    diagnosis_text = extract_primary_diagnosis(raw_output)

    return {
        "diagnosis_text": diagnosis_text,
        "raw_output": raw_output,
    }
