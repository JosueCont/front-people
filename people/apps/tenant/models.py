from django.db import models
from django_tenants.models import TenantMixin, DomainMixin
from solo.models import SingletonModel
from django.utils.translation import gettext as _


class Client(TenantMixin):
    name = models.CharField(max_length=100, verbose_name=_("Nombre"))
    timestamp = models.DateField(auto_now_add=True, verbose_name=_("Fecha de creación"))
    unlimited_licenses = models.BooleanField(default=True, verbose_name=_("¿Licencias ilimitadas?"))
    num_licenses = models.IntegerField(default=0, null=True, blank=True, verbose_name=_("Número de licencias"),
                                       help_text=_("Aplica solo si no es ilimitado"))
    available_licenses = models.IntegerField(default=0, null=True, blank=True, verbose_name=_("licencias disponibles"),
                                       help_text=_("Numero de licencias disponibles"))
    # default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Cliente")
        verbose_name_plural = _("Clientes")


class Domain(DomainMixin):

    def __str__(self):
        return self.domain

    class Meta:
        verbose_name = _("Dominio")
        verbose_name_plural = _("Dominios")
