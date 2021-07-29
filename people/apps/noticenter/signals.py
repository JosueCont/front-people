from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from .functions import Pusher
from people.apps.person.models import Person


@receiver(post_save, sender=Notification)
def send_notification(sender, **kwargs):
    """
    Notificar el estatus de la promesa
    :param sender:
    :param kwargs:
    :return:
    """
    if kwargs.get('created', False):
        notification = kwargs.get("instance")
        pusher = Pusher(notification)
        if notification.send_to_all:
            pusher.send_all_user()
        else:
            kwargs_filter = {}
            if notification.target_company:
                kwargs_filter['job_department__job__unit__in'] = [notification.target_company.id]
            if notification.target_person_type:
                kwargs_filter['person_type__id'] = notification.target_person_type.id
            if notification.target_job:
                kwargs_filter['job_department__job__id'] = notification.target_job.id
            if notification.target_gender:
                kwargs_filter['gender'] = notification.target_gender
            users_id = Person.objects.filter(**kwargs_filter).values_list('id', flat=True)
            pusher.send_to_specific_users(users_id)
