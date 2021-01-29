from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification, UserNotification
from .serializers import NotificationSerializer, UserNotificationSerializer
from people.apps.person.models import Person

# Create your views here.


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    filterset_fields = ('category', 'timestamp', 'created_by')

    def perform_create(self, serializer):
        instance = serializer.save()
        try:
            created_by = Person.objects.get(khonnect_id=self.request.data['khonnect_id'])
        except:
            created_by = None
        if created_by:
            instance.created_by = created_by
            instance.save()


class UserNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = UserNotificationSerializer
    queryset = UserNotification.objects.all()
    filterset_fields = ('is_read', 'date_read', 'notification', 'person')