from django_filters import rest_framework as filters

from people.apps.person.models import Person


class PersonFilters(filters.FilterSet):
    class Meta:
        model = Person
        fields = {'id', 'first_name'}
