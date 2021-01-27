__BEFORE_DJANGO_APPS = (  # Apps de terceros que deben cargar antes que las de Django
    'django_tenants',
)

__DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
)

__AFTER_DJANGO_APPS = (  # Apps de terceros o propias que deben cargar después que las de Django
    'people.apps.tenant',
)

__OWN_APPS = (
    'people.apps.apidoc',
    'people.apps.khonnect',
    'people.apps.person',
    'people.apps.business',
    'people.apps.setup',
    'people.apps.noticenter'
)

__THIRD_PARTY_APPS = (
    'rest_framework',
    'easy_thumbnails',
    'django_filters',
    'mailer',
    'ordered_model',
    'solo',
    'import_export',
    'colorfield',
    'drf_yasg',
    'corsheaders',
)

SHARED_APPS = (
    'django_tenants',  # mandatory, should always be before any django app
    'people.apps.tenant',  # you must list the app where your tenant model resides in
    'people.apps.setup',
    'django.contrib.contenttypes',
) + __DJANGO_APPS + __THIRD_PARTY_APPS


TENANT_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sessions',
) + __THIRD_PARTY_APPS + __OWN_APPS


INSTALLED_APPS = __BEFORE_DJANGO_APPS + __DJANGO_APPS + __AFTER_DJANGO_APPS + __OWN_APPS + __THIRD_PARTY_APPS
