# african-skin-detector

Group 38 CMU Africa Bootcamp Project - backend

## Requirements

- Python 3.11+
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

## Setup

```
git clone https://github.com/chimaOkwuokei/african-skin-detector
cd african-skin-detector/backend
uv sync
```

(Optional) for MedGemma calls to work, copy `.env.example` to
`.env` and fill in `MEDGEMMA_USER`/`MEDGEMMA_PASS`. Without these, the app
still runs fine but then MedGemma requests will just fail with an auth error.

## Run the server

```
uv run fastapi dev
```

The API is now live at `http://localhost:8000`. Interactive docs are at `http://localhost:8000/docs`.

## Run the tests

```
uv run pytest -m "not live"
```

(`-m "not live"` skips tests that call the real MedGemma endpoint
`uv run pytest -m live` if you want to check the live MedGemma.)
