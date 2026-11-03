@echo off
rem Run by Windows Task Scheduler: emails the registrations report to Patrick.
cd /d "%~dp0.."
"C:\Program Files\nodejs\node.exe" --env-file=.env.local scripts\email-report.mjs >> report-email.log 2>&1
