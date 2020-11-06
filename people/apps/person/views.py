import json

import requests
from requests import Response
from rest_framework import viewsets, status

from people.apps.khonnect.models import Config
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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validate_data = serializer.validated_data
        #if hasattr(validate_data, 'email'):
        del validate_data['email']
        #if hasattr(validate_data, 'password'):
        del validate_data['password']
        instance = Person(**serializer.validated_data)
        instance.khonnect_id = '123'
        instance.save()
        # headers = self.get_success_headers(serializer.data)
        return Response(data={"message": serializer}, status=status.HTTP_200_OK)

    def perform_create1(self, serializer):
        config = Config.objects.all().first()
        # serializer.save(khonnect_id='3434')
        try:
            headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
            url = f"{config.url_server}/signup/"
            data = {"first_name": serializer.validated_data["name"],
                    "last_name": serializer.validated_data["flast_name"] + " " + serializer.validated_data["mlast_name"],
                    "email": serializer.validated_data["email"],
                    "password": serializer.validated_data["password"]}
            response = requests.post(url, json.dumps(data), headers=headers)
            if response.ok:
                resp = json.loads(response.text)
                if resp["level"] == "success":
                    if 'user_id' in resp:
                        if resp["user_id"]:
                            serializer.save(khonnect_id=resp["user_id"])
                else:
                    return Response(data={"message": resp["level"]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)


class GeneralPersonViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.GeneralPersonSerializer
    queryset = GeneralPerson.objects.all()
    filterset_fields = ('id', 'person')
