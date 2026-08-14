@echo off
REM Runs dev.sh from cmd.exe or PowerShell on Windows.
REM
REM   dev.cmd            start both
REM   dev.cmd --reset    wipe the database and uploads first
REM   dev.cmd --backend  backend only
REM   dev.cmd --frontend frontend only
REM
REM Git Bash is located explicitly rather than using whatever "bash" is on
REM PATH, because on Windows that is usually WSL, which has its own
REM filesystem and will not see the uv and npm installed here.

setlocal

set "GIT_BASH="

if exist "%ProgramFiles%\Git\bin\bash.exe" set "GIT_BASH=%ProgramFiles%\Git\bin\bash.exe"
if not defined GIT_BASH if exist "%ProgramFiles(x86)%\Git\bin\bash.exe" set "GIT_BASH=%ProgramFiles(x86)%\Git\bin\bash.exe"
if not defined GIT_BASH if exist "%LOCALAPPDATA%\Programs\Git\bin\bash.exe" set "GIT_BASH=%LOCALAPPDATA%\Programs\Git\bin\bash.exe"

REM Fall back to deriving it from wherever git.exe lives.
if not defined GIT_BASH (
  for /f "delims=" %%G in ('where git 2^>nul') do (
    if not defined GIT_BASH (
      for %%D in ("%%~dpG..") do (
        if exist "%%~fD\bin\bash.exe" set "GIT_BASH=%%~fD\bin\bash.exe"
      )
    )
  )
)

if not defined GIT_BASH (
  echo Could not find Git Bash.
  echo Install Git for Windows from https://git-scm.com/download/win
  echo or run dev.sh from a Git Bash terminal.
  exit /b 1
)

"%GIT_BASH%" "%~dp0dev.sh" %*
