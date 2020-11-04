from rest_framework import serializers
from people.apps.person import models


class PersonTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PersonType
        fields = "__all__"


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Job
        fields = "__all__"


class GeneralPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GeneralPerson
        fields = "__all__"


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = "__all__"
