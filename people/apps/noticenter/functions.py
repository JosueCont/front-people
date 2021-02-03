from django.utils.translation import ugettext as _
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from exponent_server_sdk import PushServerError
from .models import UserDevice, UserNotification, Notification
from people.core.json_reader import json_settings
from django.utils.translation import ugettext as _
from django.template.loader import render_to_string
from people.apps.functions import global_send_mail
settings = json_settings()

# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.


class Pusher:

    def __init__(self, notification):
        self.__notification = notification

    def send_push_notification(self, to_list, extra=None):
        for device in to_list:
            user_notification = UserNotification()
            user_notification.person = device.person
            user_notification.notification = self.__notification
            try:
                PushClient().publish(
                    PushMessage(
                        to=device.device_id,
                        body=self.__notification.title,
                        data=extra,
                        priority='high',
                        sound='default',
                        badge=1
                    )
                )
                user_notification.log = "Notificación envíada"
            except PushServerError as exc:
                print(exc)
                user_notification.log = str(exc)
            except Exception as err:
                print(err)
                user_notification.log = str(err)
            user_notification.save()

    def send_all_user(self, extra=None):
        """
            Enviar push a todos los usuarios de una aplicación
        :param client_id:
        :param message:
        :param extra:
        :return:
        """

        to_devices = UserDevice.objects.all()
        self.send_push_notification(to_devices, extra)

    def send_to_specific_users(self, users_id, extra=None):
        """
            Enviar push a usuarios específicos
        :param users_id:
        :param message:
        :param extra:
        :return:
        """
        to_devices = UserDevice.objects.filter(person__id__in=users_id)
        self.send_push_notification(to_devices, extra)


class Email:

    def send_mail_vacation_status(self, vacation):
        """
            Enviar correo cuando cambie el estatus de una solicitud de vacaciones
        """
        try:
            to_email = vacation.person.email
            mail_template = "email/vacation_status.html"
            content = render_to_string(mail_template, {'url_server': settings['URL_SERVER'],
                                                       'vacation': vacation})
            if vacation.status == 2:
                subject = "Solicitud de vacaciones aprobada"
            else:
                subject = "Solicitud de vacaciones rechazada"
            global_send_mail(subject=_(subject), message=content,
                             recipient_list=[to_email])
            return 1
        except Exception as e:
            print(e)
            return False

    def send_mail_new_vacation_request(self, vacation):
        """
            Enviar correo cuando se cree una nueva solicitud
        """
        try:
            if vacation.person.report_to:
                to_email = vacation.person.report_to.email
                mail_template = "email/vacation_new.html"
                content = render_to_string(mail_template, {'url_server': settings['URL_SERVER'],
                                                           'vacation': vacation})

                global_send_mail(subject=_("Nueva solicitud de vacaciones"), message=content,
                                 recipient_list=[to_email])
                return True
        except Exception as e:
            print(e)
            return False