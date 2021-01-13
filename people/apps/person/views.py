import json
import requests
from django.db import transaction
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from tablib import Dataset

from people.apps.khonnect.models import Config
from people.apps.person import serializers
from people.apps.person.filters import PersonFilters
from people.apps.person.models import Person, PersonType, Job, GeneralPerson, Address, Training, Bank, BankAccount


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
        serializer = serializers.PersonCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        config = Config.objects.all().first()
        try:
            with transaction.atomic():
                password = serializer.validated_data["password"]
                del serializer.validated_data['password']
                instance = Person(**serializer.validated_data)
                instance.save()
                headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
                url = f"{config.url_server}/signup/"
                data_ = {"first_name": serializer.validated_data["first_name"],
                         "last_name": serializer.validated_data["flast_name"] + " " + serializer.validated_data[
                             "mlast_name"],
                         "email": serializer.validated_data["email"],
                         "password": password,
                         }
                if 'groups' in serializer.validated_data:
                    data_['groups'] = serializer.validated_data["groups"]
                response = requests.post(url, json.dumps(data_), headers=headers)
                if response.ok:
                    resp = json.loads(response.text)
                    if resp["level"] == "success":
                        if 'user_id' in resp:
                            if resp["user_id"]:
                                validate_data = serializer.validated_data
                                #del validate_data['password']
                                if 'groups' in serializer.validated_data:
                                    del validate_data['groups']
                                instance.khonnect_id = resp["user_id"]
                                instance.save()
                                person_json = serializers.PersonSerializer(instance).data
                                return Response(data=person_json, status=status.HTTP_200_OK)
                    else:
                        return Response(data={"message": resp["level"]}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    raise ValueError
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = serializers.PersonCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        config = Config.objects.all().first()

        try:
            with transaction.atomic():
                person = instance
                if 'first_name' in serializer.validated_data:
                    person.first_name = serializer.validated_data["first_name"]
                if 'flast_name' in serializer.validated_data:
                    person.flast_name = serializer.validated_data["flast_name"]
                if 'mlast_name' in serializer.validated_data:
                    person.mlast_name = serializer.validated_data["mlast_name"]
                if 'gender' in serializer.validated_data:
                    person.gender = serializer.validated_data["gender"]
                if 'email' in serializer.validated_data:
                    person.email = serializer.validated_data["email"]
                if 'birth_date' in serializer.validated_data:
                    person.birth_date = serializer.validated_data["birth_date"]
                if 'curp' in serializer.validated_data:
                    person.curp = serializer.validated_data["curp"]
                if 'rfc' in serializer.validated_data:
                    person.rfc = serializer.validated_data["rfc"]
                if 'imss' in serializer.validated_data:
                    person.imss = serializer.validated_data["imss"]
                if 'photo' in serializer.validated_data:
                    person.photo = serializer.validated_data["photo"]
                validate_data = serializer.validated_data
                if 'person_type' in validate_data:
                    person.person_type = serializer.validated_data["person_type"]
                if 'job' in validate_data:
                    person.job = validate_data["job"]
                if 'treatment' in validate_data:
                    person.treatment = validate_data["treatment"]
                person.save()
                headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
                url = f"{config.url_server}/user/update/"
                data_ = {"first_name": serializer.validated_data["first_name"],
                         "last_name": serializer.validated_data["flast_name"] + " " + serializer.validated_data[
                             "mlast_name"],
                         "user_id": person.khonnect_id,

                         }
                response = requests.post(url, json.dumps(data_), headers=headers)
                if response.ok:
                    resp = json.loads(response.text)
                    if resp["level"] == "success":
                        pass
                    else:
                        pass
                else:
                    raise ValueError
            person_json = serializers.PersonSerializer(instance).data
            return Response(data=person_json, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def general_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                general_person = GeneralPerson.objects.get(person=person)
                general_person = serializers.GeneralPersonSerializer(general_person)
                return Response(data=general_person.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)


class GeneralPersonViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GeneralPersonSerializer
    queryset = GeneralPerson.objects.all()
    filterset_fields = ('id', 'person')


class FamilyViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FamilySerializer
    queryset = GeneralPerson.objects.all()
    filterset_fields = ('id', 'person')


class ContactEmergencyViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ContactEmergencySerializer
    queryset = GeneralPerson.objects.all()
    filterset_fields = ('id', 'person')


class ExperienceJobViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ExperienceJobSerializer
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


class ImportExportPersonViewSet(APIView):
    # queryset = Person.objects.all()
    persons = serializers.PersonResource()
    dataset = Dataset()

    def post(self, request):
        try:
            new_persons = request.FILES['person']
            imported_data = self.dataset.load(new_persons.read())
            result = self.persons.import_data(self.dataset, dry_run=True)  # Test the data import
            if not result.has_errors():
                self.persons.import_data(self.dataset, dry_run=False)  # Actually import now
            return Response(data={"message": self.dataset}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format_file):
        try:
            file_format = format_file
            self.dataset = self.persons.export()
            if file_format == 'CSV':
                response = HttpResponse(self.dataset.csv, content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename="exported_data.csv"'
                return response
            elif file_format == 'JSON':
                response = HttpResponse(self.dataset.json, content_type='application/json')
                response['Content-Disposition'] = 'attachment; filename="exported_data.json"'
                return response
            elif file_format == 'XLS':
                response = HttpResponse(self.dataset.xls, content_type='application/vnd.ms-excel')
                response['Content-Disposition'] = 'attachment; filename="exported_data.xls"'
                return response
            elif file_format == 'XLSX':
                response = HttpResponse(self.dataset.xlsx, content_type='application/vnd.ms-excel')
                response['Content-Disposition'] = 'attachment; filename="exported_data.xls"'
                return response
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
