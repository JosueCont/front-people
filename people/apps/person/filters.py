from django_filters import rest_framework as filters

from people.apps.person.models import PersonType, Job, Person, GeneralPerson


class PersonFilters(filters.FilterSet):
    class Meta:
        model = Person
        fields = {'id', 'name'}
