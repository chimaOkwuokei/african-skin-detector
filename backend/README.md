# african-skin-detector

Group 38 CMU Africa Bootcamp Project - backend

To run the backend and frontend together instead, use `./dev.sh` from the
repository root. See the [main README](../README.md).

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

## Seed specialists (optional)

```
uv run python scripts/seed_demo_data.py
```

Adds a demo roster of specialists. The names are made up. The focus areas
follow published Nigerian skin disease figures (see the script). Safe to
re-run, it does nothing if specialists already exist. Assigning a case
returns 409 until at least one specialist exists.

## Run the server

```
uv run fastapi dev
```

The API is now live at `http://localhost:8000`. Interactive docs are at `http://localhost:8000/docs`.

On Windows `fastapi dev` can crash with a `UnicodeEncodeError` when its output
is not a terminal. Use `uv run uvicorn app.main:app --reload` instead.

## Run the tests

```
uv run pytest -m "not live"
```

(`-m "not live"` skips tests that call the real MedGemma endpoint
`uv run pytest -m live` if you want to check the live MedGemma.)
