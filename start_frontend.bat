@echo off
title STREAMVERSE - Next.js Frontend
echo Starting STREAMVERSE Next.js Frontend on http://localhost:3000 ...
cd /d "%~dp0frontend"
cmd.exe /c npm run dev
pause

