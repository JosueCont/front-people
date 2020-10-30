from celery.schedules import timedelta, crontab
from people.celery import app
from people.core.json_reader import json_settings

settings = json_settings()

# Celery / Celery Beat config

CELERY_BROKER_URL = settings['CELERY']["BROKER_URL"]
CELERY_RESULT_BACKEND = 'rpc'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = settings['TIME_ZONE']

app.conf.beat_schedule = {
    'send_email_by_mailer': {
        'task': 'ime.apps.notifications.tasks.send_mail_by_mailer',
        'schedule': timedelta(seconds=10),
        # 'args': (16, 16)
    },
    'validate_redeem_prizes': {
        'task': 'ime.apps.school.tasks.validate_redeem_prizes',
        'schedule': crontab(hour=0),
    },
}

app.conf.timezone = settings['TIME_ZONE']

