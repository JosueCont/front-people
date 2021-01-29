from django.utils.translation import ugettext as _
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from exponent_server_sdk import PushServerError
from .models import UserDevice, UserNotification, Notification

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

