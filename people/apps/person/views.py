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

from people.apps.business.models import NodePerson, Node, JobDepartment
from people.apps.khonnect.models import Config
from people.apps.person import serializers
from people.apps.person.filters import PersonFilters
from people.apps.person.functions import decode_file_persons
from people.apps.person.models import Person, PersonType, Job, GeneralPerson, Address, Training, Bank, BankAccount, \
    Phone, Family, ContactEmergency, JobExperience, Vacation, Document, Event
from people.apps.person.serializers import DeletePersonMassiveSerializer, GetListPersonSerializer, DocumentSerializer, \
    PhotoSerializer
from people.apps.setup.models import DocumentType


class PersonTypeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PersonTypeSerializer
    queryset = PersonType.objects.all()
    filterset_fields = ('code', 'name')


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.JobSerializer
    queryset = Job.objects.all()
    filterset_fields = ('id', 'name', 'unit')


class PersonViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PersonSerializer
    queryset = Person.objects.filter(is_deleted=False).order_by('id')
    filterset_class = PersonFilters

    def get_serializer_class(self):

        if self.action == 'delete_by_ids':
            return DeletePersonMassiveSerializer
        if self.action == 'get_list_persons':
            return GetListPersonSerializer
        if self.action == 'update_pthoto_person':
            return PhotoSerializer
        return serializers.PersonSerializer

    def create(self, request, *args, **kwargs):
        serializer = serializers.PersonCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        config = Config.objects.all().first()
        try:
            with transaction.atomic():
                password = serializer.validated_data["password"]
                del serializer.validated_data['password']
                job = None
                department = None
                groups = None
                if 'job' in serializer.validated_data:
                    job = serializer.validated_data["job"]
                    del serializer.validated_data['job']
                if 'department' in serializer.validated_data:
                    department = serializer.validated_data["department"]
                    del serializer.validated_data['department']
                if 'groups' in serializer.validated_data:
                    groups = serializer.validated_data['groups']
                    del serializer.validated_data['groups']
                job_dep = None
                if job and department:
                    job_dep = JobDepartment.objects.filter(job=job, department=department).first()
                instance = Person(**serializer.validated_data)
                if job_dep:
                    instance.job_department = job_dep
                instance.save()
                flast_name = ""
                mlast_name = ""
                if instance.flast_name:
                    flast_name = instance.flast_name
                if instance.mlast_name:
                    mlast_name = instance.mlast_name

                headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
                url = f"{config.url_server}/signup/"
                data_ = {"first_name": serializer.validated_data["first_name"],
                         "last_name": flast_name + " " + mlast_name,
                         "email": serializer.validated_data["email"],
                         "password": password,
                         }
                if groups:
                    data_['groups'] = groups
                response = requests.post(url, json.dumps(data_), headers=headers)
                if response.ok:
                    resp = json.loads(response.text)
                    if resp["level"] == "success":
                        if 'user' in resp:
                            if resp["user"]:
                                user = resp["user"]
                                instance.khonnect_id = user["id"]
                                instance.save()
                                person_json = serializers.PersonSerializer(instance).data
                                return Response(data={"person": person_json, "groups": user["groups"],
                                                      "perms": user["perms"],
                                                      "url_password_reset": user["url_password_reset"]},
                                                status=status.HTTP_200_OK)
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
                if 'is_active' in serializer.validated_data:
                    person.is_active = serializer.validated_data["is_active"]
                validate_data = serializer.validated_data
                if 'person_type' in validate_data:
                    person.person_type = serializer.validated_data["person_type"]
                if 'treatment' in validate_data:
                    person.treatment = validate_data["treatment"]
                if 'civil_status' in validate_data:
                    person.civil_status = validate_data["civil_status"]
                if 'date_of_admission' in validate_data:
                    person.date_of_admission = validate_data["date_of_admission"]
                if 'report_to' in validate_data:
                    person.report_to = validate_data["report_to"]
                if 'job' in validate_data and 'department' in validate_data:
                    job = validate_data["job"]
                    department = validate_data["department"]
                    job_dep = JobDepartment.objects.filter(job=job, department=department).first()
                    if job_dep:
                        person.job_department = job_dep
                person.save()
                nodes = None
                with transaction.atomic():
                    try:
                        if 'nodes' in validate_data:
                            nodes = validate_data['nodes']
                            #se eliminan los existentes
                            nod_per_exist = NodePerson.objects.filter(person=person)
                            if nod_per_exist:
                                for exist in nod_per_exist:
                                    exist.delete()
                           #se agregan los nuevos
                            for nod in nodes:
                                node = Node.objects.filter(id=nod).first()
                                if node:
                                    node_person = NodePerson()
                                    node_person.node = node
                                    node_person.person = instance
                                    node_person.save()
                    except:
                        raise ValueError
                flast_name = ""
                mlast_name = ""
                if person.flast_name:
                    flast_name = instance.flast_name
                if person.mlast_name:
                    mlast_name = instance.mlast_name
                headers = {'client-id': config.client_id, 'Content-Type': 'application/json'}
                url = f"{config.url_server}/user/update/"
                data_ = {"first_name": person.first_name,
                         "last_name": flast_name + " " + mlast_name,
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

    @action(detail=True, methods=['get'])
    def address_person(self, request, pk):

        if pk:
            try:
                person = self.get_object()
                address_person = Address.objects.filter(person=person)
                if address_person:
                    array_address = []
                    for address in address_person:
                        array_address.append(serializers.AddressSerialiser(address).data)
                return Response(data=array_address, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def document_person(self, request, pk):
        if pk:
            try:
                person = self.get_object()
                array_doc = []
                for doc in Document.objects.filter(person=person):
                    array_doc.append(serializers.DocumentSerializer(doc).data)
                return Response(data=array_doc, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def update_pthoto_person(self, request, pk=None):
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                person = Person.objects.filter(id=serializer.validated_data["id"]).first()
                if person:
                    person.photo = serializer.validated_data["photo"]
                    person.save()
                    data_person = serializers.PersonSerializer(person).data
                    return Response(data=data_person,
                                    status=status.HTTP_200_OK)
                else:
                    return Response(data={"message": "person not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

    def post(self, request):
        dataset = Dataset()
        try:
            new_persons = request.FILES['File']
            decoded_file = new_persons.read().decode('utf-8').splitlines()
            persons = csv.DictReader(decoded_file)
            if persons:
                res = decode_file_persons(persons)
                if res == 'ok':
                    return Response(data={"message": "Guardado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format_file):
        try:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="persons.csv"'

            writer = csv.writer(response)
            if format_file != 'plantilla':
                writer.writerow(['Nombre', 'Apellido', 'Email', 'Telefono', 'Genero', 'Nodo organizacional',
                                 'Fecha de nacimiento', 'Departamento', 'Puesto', 'CURP', 'RFC', 'IMSS'])

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
                    # row.append(person.job.name)
                    row.append(nod)
                    row.append(person.birth_date)
                    if person.job_department is not None:
                        row.append(person.job_department.department.name)
                        row.append(person.job_department.job.name)
                    else:
                        row.append('')
                        row.append('')
                    row.append(person.curp)
                    row.append(person.rfc)
                    row.append(person.imss)
                    writer.writerow(row)
            else:
                writer.writerow(['code', 'first_name', 'flast_name', 'mlast_name', 'parentid', 'email',
                                 'password', 'curp', 'job', 'code_job', 'department', 'gender'])
            return response
        except Exception as e:
            return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)


class VacationViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.VacationSerializer
    queryset = Vacation.objects.all()
    filterset_fields = ('departure_date', 'return_date')

    def perform_create(self, serializer):
        instance = serializer.save()
        try:
            person = Person.objects.get(khonnect_id=self.request.data['khonnect_id'])
        except:
            person = None
        if person:
            instance.person = person
            instance.save()


    @action(detail=False, methods=['post'])
    def approve_request(self, request, pk=None):
        if 'khonnect_id' in request.data and 'id' in request.data:
            try:
                vacation = Vacation.objects.get(id=request.data['id'])
                approved_by = Person.objects.get(khonnect_id=request.data['khonnect_id'])
                if approved_by:
                    vacation.status = 2
                    vacation.approved_by = approved_by
                    vacation.save()
                return Response(data={'message': 'Solicitud aprobada'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id/khonnect_id requerido"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def reject_request(self, request, pk=None):
        if 'khonnect_id' in request.data and 'id' in request.data:
            try:
                vacation = Vacation.objects.get(id=request.data['id'])
                rejected_by = Person.objects.get(khonnect_id=request.data['khonnect_id'])
                if rejected_by:
                    vacation.status = 3
                    vacation.comment = request.data['comment']
                    vacation.rejected_by = rejected_by
                    vacation.save()
                return Response(data={'message': 'Solicitud rechazada'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id/khonnect_id requerido"}, status=status.HTTP_400_BAD_REQUEST)


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DocumentSerializer
    queryset = Document.objects.all()
    filterset_fields = ('id', 'document_type')

    def create(self, request):
        data = request.data
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                document = Document()
                document.document_type = serializer.validated_data['document_type']
                document.person = serializer.validated_data['person']
                document.description = serializer.validated_data['description']
                document.document = serializer.validated_data['document']
                document.save()
                return Response(data={"message": "success"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = DocumentSerializer(
            instance, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                document = Document.objects.filter(id=instance.id).first()
                if document:
                    document.document_type = serializer.validated_data['document_type']
                    document.person = serializer.validated_data['person']
                    document.description = serializer.validated_data['description']
                    document.document = serializer.validated_data['document']
                    document.save()
                return Response(data={"message": "success"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EventSerializer
    queryset = Event.objects.all()
    filterset_fields = ('id', 'title')

    def create(self, request):
        # data = request.data
        serializer = serializers.EventSerializer(data=request.data)
        if serializer.is_valid():
            try:
                guests = serializer.validated_data['guests']
                node = serializer.validated_data['node']
                if node or guests:
                    event = Event()
                    event.title = serializer.validated_data['title']
                    event.date = serializer.validated_data['date']
                    event.start_time = serializer.validated_data['start_time']
                    event.end_time = serializer.validated_data['end_time']
                    event.save()
                    if guests:
                        for guest in guests:
                            person = Person.objects.filter(id=guest.id).first()
                            if person:
                                event.guests.add(person)
                    else:
                        node_org = Node.objects.filter(id=node.id).first()
                        event.node = node_org
                    event.save()
                    return Response(data={"message": "success"}, status=status.HTTP_200_OK)
                else:
                    return Response(data={"message": "it is require to select a node or at least one guest"
                                          }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = serializers.EventSerializer(
            instance, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                event = Event.objects.filter(id=instance.id).first()
                if event:
                    guests = serializer.validated_data['guests']
                    node = serializer.validated_data['node']
                    if node or guests:
                        event.title = serializer.validated_data['title']
                        event.date = serializer.validated_data['date']
                        event.start_time = serializer.validated_data['start_time']
                        event.end_time = serializer.validated_data['end_time']
                        if len(guests) > 0:
                            event.guests.set([])
                            for guest in guests:
                                person = Person.objects.filter(id=guest.id).first()
                                if person:
                                    event.guests.add(person)
                            event.node = None
                        else:
                            node_org = Node.objects.filter(id=node.id).first()
                            event.node = node_org
                            event.guests.set([])
                        event.save()
                        return Response(data={"message": "success"}, status=status.HTTP_200_OK)
                    else:
                        return Response(data={"message": "it is require to select a node or at least one guest"
                                              }, status=status.HTTP_200_OK)
                else:
                    return Response(data={"message": "Event not found"
                                          }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response(data={"message": e}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
