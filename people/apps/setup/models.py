from django.db import models

from django.utils.translation import gettext as _
from people.apps.functions import get_clean_uuid


class Relationship(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    code = models.CharField(max_length=50, unique=True, verbose_name=_("Codigo"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Parentesco")
        verbose_name_plural = _("Parentescos")


class Bank(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=100, null=True, blank=True, verbose_name=_("Nombre"))
    code = models.CharField(max_length=50, unique=True, verbose_name=_("Codigo"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Banco")
        verbose_name_plural = _("Bancos")


class ExperienceType(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    code = models.CharField(max_length=50, unique=True, verbose_name=_("Codigo"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Tipo de experiencia")
        verbose_name_plural = _("Tipos de experiencias")


class ReasonSeparation(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    code = models.CharField(max_length=50, unique=True, verbose_name=_("Codigo"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Razon de separacion")
        verbose_name_plural = _("Razones de separacion")


class LaborRelationship(models.Model):
    id = models.CharField(max_length=40, primary_key=True, default=get_clean_uuid, editable=False)
    name = models.CharField(max_length=150, verbose_name=_("Nombre"))
    code = models.CharField(max_length=50, unique=True, verbose_name=_("Codigo"))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Relacion laboral")
        verbose_name_plural = _("Relaciones laborales")
