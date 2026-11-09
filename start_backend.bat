@echo off
title STREAMVERSE - FastAPI Backend
echo Starting STREAMVERSE Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause

