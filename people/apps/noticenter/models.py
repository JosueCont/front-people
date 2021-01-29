from django.db import models
from django.utils.translation import ugettext as _
from people.apps.person.models import Person, PersonType, Job
from people.apps.business.models import Node
from ckeditor.fields import RichTextField

# Create your models here.


class Notification(models.Model):
    GENDER_CHOICES = (1, _("Masculino")), (2, _("Femenino")), (3, _("Otro"))
    CATEGORY_CHOICES = (1, _("Aviso")), (2, _("Noticia"))

    title = models.CharField(max_length=500, verbose_name=_('Título'))
    message = RichTextField(verbose_name=_('Mensaje'))
    category = models.IntegerField(choices=CATEGORY_CHOICES, verbose_name=_("Categoría"), default=1)
    # Falta la segmentación
    send_to_all = models.BooleanField(verbose_name=_("Enviar a todos"), default=False)
    target_company = models.ForeignKey(Node, on_delete=models.CASCADE, verbose_name=_("Empresa"), null=True, blank=True)
    target_person_type = models.ForeignKey(PersonType, on_delete=models.CASCADE, verbose_name=_("Tipo de persona"), null=True,
                                    blank=True)
    target_job = models.ForeignKey(Job, on_delete=models.CASCADE, verbose_name=_("Puesto"), null=True, blank=True)
    target_gender = models.IntegerField(choices=GENDER_CHOICES, verbose_name=_("Genero"), null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, editable=False, verbose_name=_('Fecha de creación'))
    created_by = models.ForeignKey(Person, on_delete=models.CASCADE, verbose_name=_('Creado por'), null=True, blank=True)

    def __str__(self):
        return '{0} - {1}'.format(self.title, self.timestamp)

    class Meta:
        verbose_name = _("Notificación")
        verbose_name_plural = _("Notificaciones")


class UserNotification(models.Model):
    """
    Historial de envío de notificaciones al usuario.
    """
    person = models.ForeignKey(Person, verbose_name=_('Person'), on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, verbose_name=_('Notificación'), on_delete=models.CASCADE)
    log = models.TextField(verbose_name=_('log'), null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))
    is_read = models.BooleanField(default=False, verbose_name=_("¿Leído?"))
    date_read = models.DateTimeField(verbose_name=_("Fecha de lectura"), null=True, blank=True)

    def __str__(self):
        return '{0} - {1} - {2}'.format(self.person, self.notification.title, self.timestamp)

    class Meta:
        verbose_name = _("Notificación de usuario")
        verbose_name_plural = _("Notificaciones de usuarios")