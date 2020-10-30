# -*- coding: utf-8 -*-
import os
from .json_reader import json_settings
from .aws import AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION

settings = json_settings()

__PATH_MEDIA = os.path.dirname(os.path.dirname(__file__))

# =====================================================
# Configuraciones adicionales Amazon S3
# =====================================================


if settings['AMAZON']['S3']['USE_S3']:
    MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)
    DEFAULT_FILE_STORAGE = 'people.core.custom_storages.MediaStorage'
else:
    MEDIA_ROOT = os.path.join(__PATH_MEDIA, '../media')
    MEDIA_URL = '/media/'


