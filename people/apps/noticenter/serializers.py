from rest_framework import serializers
from .models import Notification, UserNotification
from people.apps.business.serializers import NodeSerializer
from people.apps.person.serializers import PersonTypeSerializer, JobSerializer, PersonSerializer


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        exclude = ["created_by"]

    def to_representation(self, instance):
        representation = super(NotificationSerializer, self).to_representation(instance)
        representation['target_company'] = NodeSerializer(instance=instance.target_company).data if instance.target_company else {}
        representation['target_person_type'] = PersonTypeSerializer(instance=instance.target_person_type).data if instance.target_person_type else {}
        representation['target_job'] = JobSerializer(instance=instance.target_job).data if instance.target_job else {}
        representation['created_by'] = PersonSerializer(instance=instance.created_by).data
        return representation


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(UserNotificationSerializer, self).to_representation(instance)
        representation['person'] = PersonSerializer(instance=instance.person).data
        return representation

