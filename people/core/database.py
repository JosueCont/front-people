from .json_reader import json_settings

settings = json_settings()


DATABASES = {
            'default': {
                "ENGINE": "django_tenants.postgresql_backend",
                'HOST': settings["DB"]["HOST"],
                'NAME': settings["DB"]["NAME"],
                'USER': settings["DB"]["USER"],
                'PASSWORD': settings["DB"]["PASSWORD"],
                'PORT': settings["DB"]["PORT"],
            }
        }
DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)
