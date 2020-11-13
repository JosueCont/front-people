import json
from urllib import request

import requests
from requests import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from tablib import Dataset
from import_export import resources

from people.apps.khonnect.models import Config
from people.apps.person import serializers
from people.apps.person.filters import PersonFilters
from people.apps.person.models import Person, PersonType, Job, GeneralPerson, Address, Training, Bank, BankAccount
from django.utils.translation import ugettext_lazy as _

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
        config = Config.objects.all().first()
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
                            validate_data = serializer.validated_data
                            del validate_data['email']
                            del validate_data['password']
                            instance = Person(**serializer.validated_data)
                            instance.khonnect_id = resp["user_id"]
                            instance.save()
                            # headers = self.get_success_headers(serializer.data)
                            return Response(data={"message": serializer}, status=status.HTTP_200_OK)
                else:
                    return Response(data={"message": resp["level"]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)

    # def perform_create1(self, serializer):
    #     config = Config.objects.all().first()
    #     # serializer.save(khonnect_id='3434')
    #     try:
    #         headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
    #         url = f"{config.url_server}/signup/"
    #         data = {"first_name": serializer.validated_data["name"],
    #                 "last_name": serializer.validated_data["flast_name"] + " " + serializer.validated_data["mlast_name"],
    #                 "email": serializer.validated_data["email"],
    #                 "password": serializer.validated_data["password"]}
    #         response = requests.post(url, json.dumps(data), headers=headers)
    #         if response.ok:
    #             resp = json.loads(response.text)
    #             if resp["level"] == "success":
    #                 if 'user_id' in resp:
    #                     if resp["user_id"]:
    #                         serializer.save(khonnect_id=resp["user_id"])
    #             else:
    #                 return Response(data={"message": resp["level"]}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)


class GeneralPersonViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.GeneralPersonSerializer
    queryset = GeneralPerson.objects.all()
    filterset_fields = ('id', 'person')


class AddressViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.AddressSerialiser
    queryset = Address.objects.all()
    filterset_fields = ('id', 'person')


class TrainingViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.TrainingSerialiser
    queryset = Training.objects.all()
    filterset_fields = ('id', 'person')


class BankAccountViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.BankAccountSerialiser
    queryset = BankAccount.objects.all()
    filterset_fields = ('id', 'account_number')


class PersonaResource(resources.ModelResource):
   class Meta:
     model = Person


class ImportPersonApiView(APIView):

    def post(self, request):
        # template = loader.get_template('export/importar.html')
        if request.method == 'POST':
            try:
                person_resource = PersonaResource()
                dataset = Dataset()
                print(dataset)
                nuevas_personas = request.FILES['xlsfile']
                print(nuevas_personas)
                imported_data = dataset.load(nuevas_personas.read())
                print(dataset)
                result = person_resource.import_data(dataset, dry_run=True)  # Test the data import
                # print(result.has_errors())
                if not result.has_errors():
                    person_resource.import_data(dataset, dry_run=False)  # Actually import now
                    person_resource.save()
                    message = _("Se han agregado nuevas personas")
                    return Response(data={'message': message}, status=status.HTTP_200_OK)
                else:
                    message = _("Error al hacer el post")
                    return Response(data={'message': message}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                message = _("Ha ocurrido una excepcion")
                return Response(data={'message': message}, status=status.HTTP_404_NOT_FOUND)

        else:
            message = _("Error al hacer el post")
            return Response(data={'message': message}, status=status.HTTP_404_NOT_FOUND)



