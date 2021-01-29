from django.apps import AppConfig


class NoticenterConfig(AppConfig):
    name = 'noticenter'

    def ready(self):
        import people.apps.noticenter.signals