from django.apps import AppConfig


class NoticenterConfig(AppConfig):
    name = 'people.apps.noticenter'

    def ready(self):
        import people.apps.noticenter.signals