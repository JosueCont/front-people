import os
from fileinput import filename

from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext as _
from easy_thumbnails.fields import ThumbnailerImageField, ThumbnailerField

from people.apps.functions import get_clean_uuid
# people/apps/functions.py
from people.apps.setup.models import Relationship, ExperienceType, LaborRelationship, ReasonSeparation, Bank

MAIN_APP_PATH = 'person/'

GENDER_CHOISES = (1, _("Masculino")), (2, _("Femenino")), (3, _("Otro"))


class PersonType(models.Model):
    code = models.CharField(max_length=50, verbose_name=_("Codigo"), unique=True)
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    is_assignable = models.BooleanField(default=True, verbose_name=_("¿Asignable a personas?"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creacion"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Tipo de persona")
        verbose_name_plural = _("Tipos de personas")


class Job(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=150, verbose_name=_("Nombre de puesto"))
    code = models.CharField(max_length=50, unique=True, verbose_name=_("Codigo de puesto"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creacion"))
    unit = models.ManyToManyField("business.Node", verbose_name=_("Unidad estratégica"), null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Puesto")
        verbose_name_plural = _("Puestos")


class Person(models.Model):

    def upload_photo(self, filename):
        now = timezone.now()
        extension = os.path.splitext(filename)[1][1:]
        file_name = os.path.splitext(filename)[0]
        url = f"{MAIN_APP_PATH}images/photo-profile/%s%s%s%s%s%s/%s.%s" % (now.day, now.month, now.year, now.hour,
                                                                 now.minute, now.second,
                                                                 slugify(str(file_name)), extension)
        return url

    CIVIL_STATUS = (1, _("Soltero")), (2, _("Casado")), (3, _("Divorsiado")), (4, _("Concubinato"))

    #Informacion general y requerida pra crear un apersona
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    khonnect_id = models.CharField(max_length=40, verbose_name=_("Khonnect id"),  help_text=_("Informacion que proviene del microservicio khonnect"))
    first_name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    flast_name = models.CharField(max_length=150, verbose_name=_("Apellido paterno"))
    mlast_name = models.CharField(max_length=150, verbose_name=_("Apellido materno"), null=True, blank=True)
    gender = models.IntegerField(default=3, choices=GENDER_CHOISES, verbose_name=_("Genero"))
    email = models.EmailField(verbose_name=_("Email"), null=True, blank=True)

    #Campos opcionales
    birth_date = models.DateField(verbose_name=_("Fecha de nacimiento"), null=True, blank=True)
    curp = models.CharField(max_length=18, verbose_name=_("CURP"), null=True, blank=True)
    rfc = models.CharField(max_length=13, verbose_name=_("RFC"), null=True, blank=True)
    imss = models.CharField(max_length=11, verbose_name="IMSS", null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))
    is_deleted = models.BooleanField(default=False, verbose_name=_("¿Eliminado?"))
    is_active = models.BooleanField(default=True, verbose_name=_("¿Activo?"))
    treatment = models.ForeignKey("setup.Treatment", verbose_name=_("Tratamiento"), null=True, blank=True,
                                  on_delete=models.CASCADE)  # Cuicab
    person_type = models.ForeignKey(PersonType, on_delete=models.CASCADE, verbose_name=_("Tipo de persona"), null=True, blank=True)
    job_department = models.ForeignKey('business.JobDepartment', on_delete=models.CASCADE, verbose_name=_("Puesto de trabajo Departamento"), null=True, blank=True)
    photo = ThumbnailerImageField(upload_to=upload_photo, null=True, blank=True, verbose_name=_("Fotografia"))
    civil_status = models.IntegerField(choices=CIVIL_STATUS, verbose_name=_("Estado Civil"), null=True, blank=True)
    date_of_admission = models.DateField(verbose_name=_("Fecha de ingreso"), null=True, blank=True)

    def __str__(self):
        return self.first_name

    class Meta:
        verbose_name = _("Persona")
        verbose_name_plural = _("Personas")


class GeneralPerson(models.Model):

    def upload_photo(self, filename):
        now = timezone.now()
        extension = os.path.splitext(filename)[1][1:]
        file_name = os.path.splitext(filename)[0]
        url = f"{MAIN_APP_PATH}images/photo-profile/%s%s%s%s%s%s/%s.%s" % (now.day, now.month, now.year, now.hour,
                                                                 now.minute, now.second,
                                                                 slugify(str(file_name)), extension)
        return url

    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"), null=True, blank=True)
    place_birth = models.CharField(max_length=150,verbose_name=_("Lugar de nacimiento"), null=True, blank=True)
    nationality = models.CharField(max_length=150, verbose_name=_("Nacionalidad"), null=True, blank=True)
    other_nationality = models.CharField(max_length=150, verbose_name=_("Otra nacionaldiad"), null=True, blank=True)
    availability_travel = models.BooleanField(default=False, verbose_name=_("Disponibilidad para viajar"), null=True, blank=True)
    availability_change_residence = models.BooleanField(default=False,
                                                        verbose_name=_("Disponibilidad para cambio de residencia"), null=True, blank=True)
    allergies = models.CharField(max_length=500, verbose_name=_("Alergias"), null=True, blank=True)
    blood_type = models.CharField(max_length=10, verbose_name=_("Tipo de sangre"), null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("General")
        verbose_name_plural = _("Generales")


class Family(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"))
    relationship = models.ForeignKey(Relationship, on_delete=models.CASCADE, verbose_name=_("Parentesco"))
    job = models.ForeignKey(Job, on_delete=models.CASCADE, verbose_name=_("Puesto de trabajo"))
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    flast_name = models.CharField(max_length=150, verbose_name=_("Apellido paterno"))
    mlast_name = models.CharField(max_length=150, verbose_name=_("Apellido materno"))
    gender = models.IntegerField(choices=GENDER_CHOISES, verbose_name=_("Genero"))
    life = models.BooleanField(default=True, verbose_name=_("¿Vive?"))
    birth_date = models.DateField(verbose_name=_("Fecha de nacimiento"), null=True, blank=True)
    benefit = models.CharField(max_length=50, verbose_name=_("% Beneficio"))
    place_birth = models.CharField(max_length=150, verbose_name=_("Lugar de nacimiento"), null=True, blank=True)
    nationality = models.CharField(max_length=150, verbose_name=_("Nacionalidad"), null=True, blank=True)
    other_nationality = models.CharField(max_length=150, verbose_name=_("Otra nacionaldiad"), null=True, blank=True)
    is_deleted = models.BooleanField(default=False, verbose_name=_("¿Eliminado?"))

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Familiar")
        verbose_name_plural = _("Familiares")


class Address(models.Model):

    STREET_TYPE = (1, _("Avenida")), (2, _("Boulevaard")), (3, _("Calle"))

    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"), null=True, blank=True)
    street_type = models.IntegerField(choices=STREET_TYPE, verbose_name=_("Tipo de calle"), null=True, blank=True)
    street = models.CharField(max_length=100, verbose_name=_("Calle"), null=True, blank=True)
    numberOne = models.CharField(max_length=50, verbose_name=_("Numero exterior"), null=True, blank=True)
    numberTwo = models.CharField(max_length=50, verbose_name=_("Numero interior"), null=True, blank=True)
    building = models.CharField(max_length=50, verbose_name=_("Edificio"), null=True, blank=True)
    postalCode = models.CharField(max_length=50, verbose_name=_("Codigo postal"), null=True, blank=True)
    suburb = models.CharField(max_length=100, verbose_name=_("Suburbio"), null=True, blank=True)
    location = models.CharField(max_length=300, verbose_name=_("Ubicacion del domicilio"))
    reference = models.IntegerField(verbose_name=_("Referencia"), null=True, blank=True)

    def __str__(self):
        return self.street

    class Meta:
        verbose_name = _("Direccion")
        verbose_name_plural = _("Direcciones")


class Phone(models.Model):

    PHONE_TYPE = (1, _("Alterno")), (2, _("Principal")), (3, _("Recados"))
    LINE_TYPE = (1, _("Celular")), (2, _("Fijo"))

    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"))
    country_code = models.CharField(max_length=20, verbose_name=_("Codigo del pais"))
    international_code = models.CharField(max_length=20, verbose_name=_("Codigo internacional"))
    national_code = models.CharField(max_length=20, verbose_name=_("Codigo nacional"))
    phone = models.CharField(max_length=20, verbose_name=_("Telefono"))
    phone_type = models.IntegerField(choices=PHONE_TYPE, verbose_name=("Tipo de telefono"))
    line_type = models.IntegerField(choices=LINE_TYPE, verbose_name=("Tipo de linea"))

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Telefono")
        verbose_name_plural = _("Telefonos")


class ContactEmergency(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, null=True, blank=True, on_delete=models.CASCADE, verbose_name=_("Persona"))
    relationship = models.ForeignKey(Relationship, on_delete=models.CASCADE, verbose_name=_("Parentesco"))
    address = models.CharField(max_length=150, verbose_name=_("Direccion"))
    fullname = models.CharField(max_length=150, verbose_name=_("Nombre completo"))
    phone_one = models.CharField(max_length=150, verbose_name=_("Numero telefonico 1"))
    phone_two = models.CharField(max_length=150, verbose_name=_("Numero telefonico 2"))

    def __str__(self):
        return self.fullname

    class Meta:
        verbose_name = _("Contacto de emergencia")
        verbose_name_plural = _("Contactos de emergencia")


class JobExperience(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"), null=True, blank=True)
    experience_type = models.ForeignKey(ExperienceType, on_delete=models.CASCADE, verbose_name=_("Tipo de experiencia"))
    labor_relationship = models.ForeignKey(LaborRelationship, on_delete=models.CASCADE, verbose_name=_("Relacion laboral"))
    reason_separation = models.ForeignKey(ReasonSeparation, on_delete=models.CASCADE, verbose_name=_("Motivo de separacion"))
    company = models.CharField(max_length=150, verbose_name=_("Empresa"))
    since = models.DateField(verbose_name=_("Fecha de inicio"))
    until = models.DateField(verbose_name=_("Fecha de termino"))
    turn = models.CharField(max_length=150, verbose_name=_("Giro empresarial"))
    function = models.CharField(max_length=350, verbose_name=_("Funciones"))
    starting_salary = models.CharField(max_length=150, verbose_name=_("Salario incial"))
    last_salary = models.CharField(max_length=150, verbose_name=_("Salario final"))
    immediate_boos = models.CharField(max_length=150, verbose_name=_("Jefe inmediato"))
    address_company = models.CharField(max_length=300, verbose_name=_("Direccion de la empresa"))
    phone_company = models.CharField(max_length=40,  verbose_name=_("Telefono de la empresa"))
    notes = models.CharField(max_length=300, verbose_name=_("Notas"))
    cv = models.CharField(max_length=300, verbose_name=_("Curriculum"))

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Experiencia laboral")
        verbose_name_plural = _("Experiencias laborales")


class Training(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"), null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True, verbose_name=_("Escuela"))
    since = models.DateField(auto_now_add=False, verbose_name=_("Fecha de inicio"))
    until = models.DateField(auto_now_add=False, verbose_name=_("Fecha de termino"))
    accreditation_document = models.CharField(max_length=50, null=True, blank=True, verbose_name=_("Documeto de acreditacion"))
    currently_studing = models.BooleanField(default=False, null=True, blank=True, verbose_name=_("Estudia actualmente"))
    completed_period = models.IntegerField(null=True, blank=True, verbose_name=_("Periodo completado"))

    def __str__(self):
        return self.school

    class Meta:
        verbose_name = _("Formacion")
        verbose_name_plural = _("Formaciones")


class BankAccount(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, verbose_name=_("Banco"), null=True, blank=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"), null=True, blank=True)
    account_number = models.CharField(max_length=40, null=True, blank=True, verbose_name=_("Numero de cuenta"))
    interbank_key = models.CharField(max_length=40, null=True, blank=True, verbose_name=_("Clave interbancaria"))

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Numero de cuenta")
        verbose_name_plural = _("Numeros de cuentas")


class Vacancy(models.Model):
    STATUS_CHOICES = (
        (1, _("Activo")),
        (2, _("Cancelado"))
    )

    job = models.ForeignKey(Job, verbose_name=_("Puesto"), on_delete=models.CASCADE)
    description = models.TextField(verbose_name=_("Descripción"))
    status = models.IntegerField(choices=STATUS_CHOICES, default=1)
    users_applied = models.ManyToManyField(Person, verbose_name=_("Usuarios que aplicaron"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return "{0} - {1}".format(self.job.name, self.job.code)

    class Meta:
        verbose_name = _("Vacante(Plaza)")
        verbose_name_plural = _("Vacantes(Plazas)")
