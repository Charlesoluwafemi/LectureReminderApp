@echo off
set DJANGO_SETTINGS_MODULE=lecture_notify.settings
celery -A lecture_notify worker -l info
pause
