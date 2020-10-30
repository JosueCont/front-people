from .json_reader import json_settings

settings = json_settings()

THUMBNAIL_ALIASES = {
    '': {
        'avatar': {'size': (50, 50), 'crop': False},
        'avatar_crop': {'size': (75, 75), 'crop': True},
        'company': {'size': (50, 50), 'crop': False},
        'payment_method': {'size': (120, 50), 'crop': False},
        'category': {'size': (296, 202), 'crop': True},
        'subcategory': {'size': (50, 50), 'crop': True},
        'event_type': {'size': (323, 202), 'crop': True, 'quality': 100},
        'logo': {'size': (35, 35), 'crop': False},
        'favicon': {'size': (16, 16), 'crop': False},
        'card': {'size': (400, 240), 'crop': False},
        'cover_crop': {'size': (2280, 600), 'crop': True, 'quality': 100},
    },
}

THUMBNAIL_BASEDIR = "thumbs"
