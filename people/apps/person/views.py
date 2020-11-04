
from rest_framework import viewsets

from people.apps.person import serializers
from people.apps.person.filters import PersonFilters
from people.apps.person.models import Person, PersonType, Job, GeneralPerson


class PersonTypeViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.PersonTypeSerializer
    queryset = PersonType.objects.all()
    filterset_fields = ('code', 'name')


class JobViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.JobSerializer
    queryset = Job.objects.all()
    filterset_fields = ('id', 'name')


class PersonViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.PersonSerializer
    queryset = Person.objects.filter(is_deleted=False).order_by('id')
    filterset_class = PersonFilters


class PersonViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.PersonSerializer
    queryset = Person.objects.all()
    filterset_fields = ('id', 'name')


class GeneralPersonViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.GeneralPersonSerializer
    queryset = GeneralPerson.objects.all()
    filterset_fields = ('id', 'person')
