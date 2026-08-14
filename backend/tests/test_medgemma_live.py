import pytest
from app.integrations.analysis_model import analyze_lesion_image

pytestmark = pytest.mark.live  # tag so you can skip these by default


@pytest.mark.asyncio
async def test_real_medgemma_call_with_sample_image():
    with open("tests/fixtures/sample_lesion.jpg", "rb") as f:
        image_bytes = f.read()

    result = await analyze_lesion_image(
        image_bytes=image_bytes,
        patient_context="45M, raised dark lesion on back, present 6 months",
    )

    print("\n--- MedGemma response ---\n", result)
    assert isinstance(result, str)
    assert len(result) > 0
