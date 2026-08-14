from unittest.mock import AsyncMock, patch

import pytest
from app.integrations.analysis_model import MedGemmaWarmingUp, analyze_lesion_image


@pytest.mark.asyncio
async def test_analyze_lesion_image_parses_response():
    fake_response_json = {
        "choices": [
            {
                "message": {
                    "content": "This appears to be a benign seborrheic keratosis."
                }
            }
        ]
    }

    with patch("app.integrations.analysis_model.httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_response.json = lambda: fake_response_json
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client_cls.return_value.__aenter__.return_value = mock_client

        result = await analyze_lesion_image(
            image_bytes=b"fake-image-bytes",
            patient_context="34F, itchy mole on forearm",
        )

    assert "seborrheic keratosis" in result


@pytest.mark.asyncio
async def test_analyze_lesion_image_raises_on_503():
    with patch("app.integrations.analysis_model.httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_response = AsyncMock()
        mock_response.status_code = 503
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client_cls.return_value.__aenter__.return_value = mock_client

        with pytest.raises(MedGemmaWarmingUp):
            await analyze_lesion_image(b"fake-bytes", "context")
