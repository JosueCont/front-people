CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
             'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['RemoveFormat', 'Table']
        ]
    },
    'admin': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
             'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['-', 'Iframe', ],
            ['RemoveFormat', 'Source'],
            ['Image', 'Styles'],
            ['FontSize', 'Format', 'Font', 'TextColor', 'BGColor'],
            ['Maximize'],
            ['Undo', 'Redo'],
        ],
        'height': 400,
        'width': 1000,
        'extraPlugins': ','.join([
            # your extra plugins here
            # 'image2',
            'autolink',
            'autoembed',
            'embedsemantic',
            'autogrow',
            # 'devtools',
            'widget',
            'lineutils',
            'clipboard',
            'elementspath'
        ]),
        # 'skin': 'minimalist',
    },
    'purpura_default': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
             'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['RemoveFormat']
        ],
        'height': 200,
        'width': '100%',
        'removePlugins': ','.join([
            # your extra plugins here
            'resize'
        ]),
    },
    'purpura_new_text_lesson': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Font', 'Format', 'FontSize'],
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
             'JustifyRight', 'JustifyBlock'],
            ['Image', 'Styles'],
            ['Link', 'Unlink'],
            ['RemoveFormat']
        ],
        'height': 400,
        'removePlugins': ','.join([
            # your extra plugins here
            'resize'
        ]),
    },
    'notes_lesson': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
             'JustifyRight', 'JustifyBlock'],
            ['RemoveFormat']
        ],
        'height': 250,
        'removePlugins': ','.join([
            # your extra plugins here
            'resize'
        ]),
    },
    'post': {
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Font', 'Format', 'FontSize'],
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
             'JustifyRight', 'JustifyBlock'],
            ['RemoveFormat']
        ],
        'height': 400,
        'removePlugins': ','.join([
            # your extra plugins here
            'resize'
        ]),
    },
}

CKEDITOR_UPLOAD_PATH = "uploads/"
