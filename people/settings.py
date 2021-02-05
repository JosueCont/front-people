import os, datetime
import platform
from .core.applist import *
from .core.database import *
from .core.internationalization import *
from .core.aws import *
from .core.mediafiles import *
from .core.staticfiles import *
from .core.sentry import *
from .core.json_reader import json_settings
from .core.mailserver import *
from .core.api import *
from .core.thumbnails import *
from .core.ckeditor import *
from .core.celery_beats import *
from .core.cache import *
from .core.file_permissions import *

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

settings = json_settings()

SECRET_KEY = settings['SECURITY']['SECRET_KEY']
DEBUG = settings['DEBUG']
URL_SERVER = settings['URL_SERVER']
ALLOWED_HOSTS = settings['SECURITY']['ALLOWED_HOSTS']

MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

ROOT_URLCONF = 'people.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'people/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',  # Puede ser que ya no sea necesario por ser API
                'django.template.context_processors.i18n',  # Puede ser que ya no sea necesario por ser API
            ],
        },
    },
]

REST_USE_JWT = True

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(hours=12)
}

CORS_ORIGIN_ALLOW_ALL = True

WSGI_APPLICATION = 'people.wsgi.application'

LOGIN_URL = "/login/"  # con que url se hablara siempre al login

# if os.name == 'nt':  # Esto solo aplica para windows.
#     lib_names = ['gdal204', 'gdal202', 'gdal201', 'gdal20', 'gdal111', 'gdal110', 'gdal19']
#
#     OSGEO4W = r"C:\OSGeo4W"
#     if '64' in platform.architecture()[0]:
#         OSGEO4W += "64"
#     assert os.path.isdir(OSGEO4W), "Directory does not exist: " + OSGEO4W
#     os.environ['OSGEO4W_ROOT'] = OSGEO4W
#     os.environ['GDAL_DATA'] = OSGEO4W + r"\share\gdal"
#     os.environ['PROJ_LIB'] = OSGEO4W + r"\share\proj"
#     os.environ['PATH'] = OSGEO4W + r"\bin;" + os.environ['PATH']


# Additional Considerations if project run over HTTPS.
# by. Alex Dzul.
if settings["USE_HTTPS"]:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
    # SECURE_BROWSER_XSS_FILTER = True
    # SECURE_HSTS_SECONDS = 3600
    # SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    # SECURE_HSTS_PRELOAD = True
    # SECURE_SSL_REDIRECT = True

TENANT_MODEL = 'tenant.Client'
TENANT_DOMAIN_MODEL = "tenant.Domain"  # app.Model
