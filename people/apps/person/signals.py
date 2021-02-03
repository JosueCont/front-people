from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Vacation
from people.apps.noticenter.functions import Email, Pusher
from people.apps.person.models import Person


@receiver(post_save, sender=Vacation)
def send_email(sender, **kwargs):
    """
    Notificar el estatus de la solicitud de vacaciones
    :param sender:
    :param kwargs:
    :return:
    """
    if not kwargs.get('created', False):
        vacation = kwargs.get("instance")
        pusher = Pusher()
        if vacation.status != 1:
            if vacation.status == 2:
                message = "Solicitud aprobada"
            else:
                message = "Solicitud rechazada"
            pusher.notify_vacation_status([vacation.person.email], message)
    else:
        vacation = kwargs.get("instance")
        email_class = Email()
        email_class.send_mail_new_vacation_request(vacation)