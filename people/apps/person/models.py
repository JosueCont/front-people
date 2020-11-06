from django.db import models
from django.utils.translation import gettext as _
from people.apps.functions import get_clean_uuid
# people/apps/functions.py

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
