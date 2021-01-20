import csv
import json
import requests
from django.db import transaction
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from tablib import Dataset

from people.apps.business.models import NodePerson, Node
from people.apps.khonnect.models import Config
from people.apps.person import serializers
from people.apps.person.filters import PersonFilters
from people.apps.person.functions import save_persons, decode_file_persons
from people.apps.person.models import Person, PersonType, Job, GeneralPerson, Address, Training, Bank, BankAccount, \
    Phone, Family, ContactEmergency, JobExperience
from people.apps.person.serializers import DeletePersonMassiveSerializer, GetListPersonSerializer


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

    def get_serializer_class(self):

        if self.action == 'delete_by_ids':
            return DeletePersonMassiveSerializer
        if self.action == 'get_list_persons':
            return GetListPersonSerializer
        return serializers.PersonSerializer

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
                                # del validate_data['password']
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
                if 'civil_status' in validate_data:
                    person.civil_status = validate_data["civil_status"]
                if 'date_of_admission' in validate_data:
                    person.date_of_admission = validate_data["date_of_admission"]
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

    @action(detail=False, methods=['post'])
    def delete_by_ids(self, request, pk=None):
        serializer = DeletePersonMassiveSerializer(data=request.data)
        config = Config.objects.all().first()
        if serializer.is_valid():
            try:
                persons_id = serializer.data['persons_id'].split(',')
                for person_id in persons_id:
                    with transaction.atomic():
                        person = Person.objects.get(pk=person_id)
                        if person:
                            khonnect_id = person.khonnect_id
                            person.delete()
                            headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
                            url = f"{config.url_server}/user/delete/"
                            data_ = {"user_id": khonnect_id}
                            response = requests.post(url, json.dumps(data_), headers=headers)
                            if response.ok:
                                resp = json.loads(response.text)
                                if resp["level"] == "success":
                                    pass
                            else:
                                raise ValueError
                return Response(data={"message": "Se eliminaron las personas correctamente"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def get_list_persons(self, request, pk=None):
        serializer = GetListPersonSerializer(data=request.data)
        if serializer.is_valid():
            try:
                persons = None
                if 'first_name' in serializer.validated_data:
                    if 'gender' in serializer.validated_data:
                        persons = Person.objects.filter(first_name=serializer.validated_data["first_name"],
                                                        is_active=serializer.validated_data["is_active"],
                                                        gender=serializer.validated_data["gender"])
                    else:
                        persons = Person.objects.filter(first_name=serializer.validated_data["first_name"],
                                                        is_active=serializer.validated_data["is_active"])
                else:
                    if 'gender' in serializer.validated_data:
                        persons = Person.objects.filter(gender=serializer.validated_data["gender"],
                                                        is_active=serializer.validated_data["is_active"])
                    else:
                        if 'is_active' in serializer.validated_data:
                            persons = Person.objects.filter(is_active=serializer.validated_data["is_active"])
                if persons:
                    person_json = []
                    for person in persons:
                        person_json.append(serializers.PersonSerializer(person).data)
                return Response(data=person_json,
                                status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def phone_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                phone_person = Phone.objects.filter(person=person)
                if phone_person:
                    array_phones = []
                    for phone in phone_person:
                        array_phones.append(serializers.PhoneSerialiser(phone).data)
                return Response(data=array_phones, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def family_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                family_person = Family.objects.filter(person=person)
                if family_person:
                    array_family = []
                    for family in family_person:
                        array_family.append(serializers.FamilySerializer(family).data)
                return Response(data=array_family, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def contact_emergency_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                contact_person = ContactEmergency.objects.filter(person=person)
                if contact_person:
                    array_contact = []
                    for contact in contact_person:
                        array_contact.append(serializers.ContactEmergencySerializer(contact).data)
                return Response(data=array_contact, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def training_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                training_person = Training.objects.filter(person=person)
                if training_person:
                    array_training = []
                    for training in training_person:
                        array_training.append(serializers.TrainingSerialiser(training).data)
                return Response(data=array_training, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def bank_account_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                bank_account_person = BankAccount.objects.filter(person=person)
                if bank_account_person:
                    array_bank_account = []
                    for training in bank_account_person:
                        array_bank_account.append(serializers.BankAccountSerialiser(training).data)
                return Response(data=array_bank_account, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def job_experience_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                job_experience_person = JobExperience.objects.filter(person=person)
                if job_experience_person:
                    array_job_experience = []
                    for job_experience in job_experience_person:
                        array_job_experience.append(serializers.ExperienceJobSerializer(job_experience).data)
                return Response(data=array_job_experience, status=status.HTTP_200_OK)
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
    queryset = Family.objects.all()
    filterset_fields = ('id', 'person')


class ContactEmergencyViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ContactEmergencySerializer
    queryset = ContactEmergency.objects.all()
    filterset_fields = ('id', 'person')


class ExperienceJobViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ExperienceJobSerializer
    queryset = JobExperience.objects.all()
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


class PhoneViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PhoneSerialiser
    queryset = Phone.objects.all()
    filterset_fields = ('id', 'phone')


class ImportExportPersonViewSet(APIView):
    # queryset = Person.objects.all()
    persons = serializers.PersonResource()
    dataset = Dataset()

    def post(self, request):
        dataset = Dataset()
        try:
            new_persons = request.FILES['File']
            imported_data = dataset.load(new_persons.read())
            persons = imported_data.dict
            if persons:
                res = decode_file_persons(persons)
                if res == 'OK':
                    return Response(data={"message": "Guardado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format_file):
        try:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="persons.csv"'

            writer = csv.writer(response)
            writer.writerow(['Nombre', 'Apellido', 'Email', 'Telefono', 'Genero', 'Puesto', 'Nodo organizacional'])

            persons = Person.objects.all()
            for person in persons:
                row = []
                nod = ''
                phone = ''
                try:
                    node_person = NodePerson.objects.get(person=person)
                    if node_person:
                        nod = node_person.node.name
                except:
                    None
                try:
                    phone_person = Phone.objects.get(person=person)
                    if phone_person:
                        phone = phone_person.phone
                except:
                    None
                row.append(person.first_name)
                row.append(person.flast_name)
                row.append(person.email)
                row.append(phone)
                gend = ''
                if person.gender == 1:
                    gend = 'Masculino'
                if person.gender == 2:
                    gend = 'Femenino'
                if person.gender == 3:
                    gend = 'Otro'
                row.append(gend)
                row.append(person.job.name)
                row.append(nod)
                writer.writerow(row)
            return response
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
