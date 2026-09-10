@echo off
set "PATH=C:\Program Files\nodejs;C:\Users\DELL\AppData\Roaming\npm-global;%PATH%"
cd /d "%~dp0"
call npm run dev
