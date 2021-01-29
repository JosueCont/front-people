from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
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
