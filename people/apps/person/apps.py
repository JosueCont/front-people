from django.apps import AppConfig


class PersonConfig(AppConfig):
    name = 'people.apps.person'

    def ready(self):
        import people.apps.person.signals