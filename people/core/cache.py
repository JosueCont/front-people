from people.core.json_reader import json_settings

settings = json_settings()

CACHES = {
    'default': {
        'BACKEND': settings['CACHE']['BACKEND'],
        'LOCATION': 'redis://{0}:{1}/1'.format(settings['CACHE']['IP'], settings['CACHE']['PORT']),
        'KEY_PREFIX': settings['CACHE']['KEY_PREFIX'],
        "TIMEOUT": settings['CACHE']['TIMEOUT'],
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_CONNECT_TIMEOUT": 10,  # in seconds
            "SOCKET_TIMEOUT": 10,  # in seconds
        }
    }
}

if not settings["DEBUG"]:
    # Aplica solo para producción. sesiones utilizando Redis.
    SESSION_ENGINE = "django.contrib.sessions.backends.cache"
    SESSION_CACHE_ALIAS = "default"
