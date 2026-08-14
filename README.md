# african-skin-detector
Group 38 CMU Africa Bootcamp Project

## Running locally

You need [uv](https://docs.astral.sh/uv/getting-started/installation/) for the
backend and [Node.js](https://nodejs.org/) for the frontend.

```
./dev.sh          macOS, Linux, Git Bash
dev.cmd           Windows cmd prompt or PowerShell
```

The `.sh` version will not run from the Windows cmd prompt, which is why the
`.cmd` wrapper exists. Avoid `bash dev.sh` on Windows: `bash` there usually
resolves to WSL, which cannot see the uv and npm installed on Windows.

That installs any missing dependencies, seeds a roster of specialists, and
starts both servers:

| | |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |

Ctrl+C stops both.

### Options

The same flags work with either entry point.

```
./dev.sh --reset      delete the local database and uploads first
./dev.sh --backend    backend only
./dev.sh --frontend   frontend only
```

Ports can be overridden with `BACKEND_PORT` and `FRONTEND_PORT`.

### When to use --reset

The database has no migrations yet, so if someone changes a model, your
existing `backend/demo.db` keeps the old columns and requests start failing
with errors like `table patient has no column named date_of_birth`. Running
`./dev.sh --reset` deletes the file and rebuilds it. Stop any running server
first, otherwise the file stays locked.

## Project layout

- `backend/` FastAPI service. See [backend/README.md](backend/README.md) for
  running it on its own, the MedGemma credentials, and the tests.
- `frontend/` Next.js app. See [frontend/README.md](frontend/README.md).
