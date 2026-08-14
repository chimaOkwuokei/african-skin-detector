import base64

import httpx

from app.core.config import settings


class MedGemmaError(Exception):
    """Raised when the MedGemma endpoint fails or returns something unusable."""


class MedGemmaWarmingUp(MedGemmaError):
    """Raised when the model container is still starting up (HTTP 503)."""


def _encode_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{b64}"


def _basic_auth_header() -> str:
    raw = f"{settings.medgemma_user}:{settings.medgemma_pass}".encode()
    return "Basic " + base64.b64encode(raw).decode("utf-8")


async def analyze_lesion_image(
    image_bytes: bytes,
    patient_context: str,
    mime_type: str = "image/jpeg",
) -> str:
    """
    Sends a lesion image + patient context to MedGemma hosted on modal. Returns the raw text response.

    Raises MedGemmaWarmingUp if the container is still cold-starting. Raises MedGemmaError for any other failure.
    """
    image_data_url = _encode_image(image_bytes, mime_type)

    prompt = (
        "You are assisting a healthcare worker with a preliminary assessment "
        "of a skin lesion photo. Describe what you observe and give your best "
        "assessment of what this could be. This is not a final diagnosis and "
        "will be reviewed by a specialist.\n\n"
        f"Patient context: {patient_context}\n\n"
        "After your full assessment, end your response with exactly these two "
        "lines, with nothing else on either line:\n"
        "PRIMARY_DIAGNOSIS: <short name of the single most likely diagnosis>\n"
        "MODEL_URGENCY_NOTE: <one short phrase on how soon you'd want a "
        "specialist to see this, e.g. 'no rush' or 'recommend prompt review'>"
    )

    payload = {
        "model": settings.medgemma_model_name,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_data_url}},
                ],
            }
        ],
        "max_tokens": 512,
        "temperature": 0.2,
    }

    headers = {
        "Authorization": _basic_auth_header(),
        "Content-Type": "application/json",
    }

    url = f"{settings.medgemma_base_url}/v1/chat/completions"

    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(url, json=payload, headers=headers)
    except httpx.RequestError as exc:
        raise MedGemmaError(f"Network error calling MedGemma: {exc}") from exc

    if response.status_code == 503:
        raise MedGemmaWarmingUp("MedGemma model is still starting up, retry shortly.")

    if response.status_code == 401:
        raise MedGemmaError("MedGemma auth rejected. Check MEDGEMMA_USER/PASS.")

    if response.status_code != 200:
        raise MedGemmaError(
            f"MedGemma returned {response.status_code}: {response.text}"
        )

    try:
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, ValueError) as exc:
        raise MedGemmaError(f"Unexpected response shape from MedGemma: {exc}") from exc
