from django.db import models
from django.utils.translation import gettext as _
from people.apps.functions import get_clean_uuid
# people/apps/functions.py
from people.apps.setup.models import Relationship, ExperienceType, LaborRelationship, ReasonSeparation, Bank


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

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Puesto")
        verbose_name_plural = _("Puestos")


class Person(models.Model):
    #Informacion general y requerida pra crear un apersona
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    khonnect_id = models.CharField(max_length=40, verbose_name=_("Khonnect id"), null=True, blank=True, help_text=_("Informacion que proviene del microservicio khonnect"))
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    flast_name = models.CharField(max_length=150, verbose_name=_("Apellido paterno"))
    mlast_name = models.CharField(max_length=150, verbose_name=_("Apellido materno"))
    person_type = models.ForeignKey(PersonType, on_delete=models.CASCADE, verbose_name=_("Tipo de persona"))
    job = models.ForeignKey(Job, on_delete=models.CASCADE, verbose_name=_("Puesto de trabajo"))

    #Campos opcionales
    birth_date = models.DateField(verbose_name=_("Fecha de nacimiento"), null=True, blank=True)
    curp = models.CharField(max_length=18, verbose_name=_("CURP"), null=True, blank=True)
    rfc = models.CharField(max_length=13, verbose_name=_("RFC"), null=True, blank=True)
    imss = models.CharField(max_length=11, verbose_name="IMSS", null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))
    is_deleted = models.BooleanField(default=False, verbose_name=_("¿Eliminado?"))
    is_active = models.BooleanField(default=True, verbose_name=_("¿Activo?"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Persona")
        verbose_name_plural = _("Personas")


class GeneralPerson(models.Model):
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
    person = models.ForeignKey(Person, verbose_name=_("Persona"), on_delete=models.CASCADE)
    relationship = models.ForeignKey(Relationship, verbose_name=_("Parentesco"), on_delete=models.CASCADE)
    fullname = models.CharField(max_length=40, verbose_name=_("Nombre completo"))

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Familiar")
        verbose_name_plural = _("Familiares")


class Address(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_("Persona"), null=True, blank=True)
    street = models.CharField(max_length=100, verbose_name=_("Calle"), null=True, blank=True)
    numberOne = models.CharField(max_length=50, verbose_name=_("Numero uno"), null=True, blank=True)
    numberTwo = models.CharField(max_length=50, verbose_name=_("Numero dos"), null=True, blank=True)
    building = models.CharField(max_length=50, verbose_name=_("Edificio"), null=True, blank=True)
    reference = models.IntegerField(verbose_name=_("Referencia"), null=True, blank=True)
    postalCode = models.CharField(max_length=50, verbose_name=_("Codigo postal"), null=True, blank=True)
    suburb = models.CharField(max_length=100, verbose_name=_("Suburbio"), null=True, blank=True)

    def __str__(self):
        return self.id

    class Meta:
        verbose_name = _("Direccion")
        verbose_name_plural = _("Direcciones")


class ContactEmergency(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    relationship = models.ForeignKey(Relationship, verbose_name=_("Parentesco"), on_delete=models.CASCADE)
    address = models.ForeignKey(Address, verbose_name=_("Direccion"), on_delete=models.CASCADE)
    fullname = models.CharField(max_length=150, verbose_name=_("Nombre completo"))
    phone_one = models.CharField(max_length=150, verbose_name=_("Numero telefonico 1"))
    phone_two = models.CharField(max_length=150, verbose_name=_("Numero telefonico 2"))

    def __str__(self):
        return self.fullname

    class Meta:
        verbose_name = _("Contacto de emergencia")
        verbose_name_plural = _("Contactos de emergencia")


class ExperieneJob(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    experience_type = models.ForeignKey(ExperienceType, verbose_name=_("Tipo de experiencia"), on_delete=models.CASCADE)
    labor_relationship = models.ForeignKey(LaborRelationship, verbose_name=_("Relacion laboral"), on_delete=models.CASCADE)
    reason_separation = models.ForeignKey(ReasonSeparation, verbose_name=_("Motivo de separacion"), on_delete=models.CASCADE)
    company = models.CharField(max_length=150, verbose_name=_("Empresa"))
    since = models.DateTimeField(verbose_name=_("Fecha de inicio"))
    until = models.DateTimeField(verbose_name=_("Fecha de termino"))
    turn = models.CharField(max_length=150, verbose_name=_("Giro empresarial"))
    function = models.CharField(max_length=350, verbose_name=_("Funciones"))
    startin_salary = models.CharField(max_length=150, verbose_name=_("Salario incial"))
    last_salary = models.CharField(max_length=150, verbose_name=_("Salario final"))
    immediate_boos = models.CharField(max_length=150, verbose_name=_("Jefe inmediato"))
    addres_company = models.CharField(max_length=300, verbose_name=_("Direccion de la empresa"))
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
    since = models.DateTimeField(auto_now_add=False, verbose_name=_("Fecha de inicio"))
    until = models.DateTimeField(auto_now_add=False, verbose_name=_("Fecha de termino"))
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
