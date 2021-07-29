from django.db import models
from django.utils.translation import ugettext_lazy as _


class Config(models.Model):
    secret_key = models.CharField(max_length=500, null=True, blank=True, verbose_name=_('Llave secreta'))
    client_id = models.CharField(max_length=255, null=True, blank=True, verbose_name=_('Cliente id'))
    url_server = models.URLField(null=True, blank=True, verbose_name=_("URL del servicio"))

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name = _("Configuración")
        verbose_name_plural = _("Configuración")

