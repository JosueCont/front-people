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
    email = serializers.EmailField(max_length=40)
    password = serializers.CharField(max_length=40)

    class Meta:
        model = models.Person
        fields = ['name', 'flast_name', 'mlast_name', 'birth_date', 'curp', 'rfc', 'imss', 'is_deleted', 'is_active', 'person_type', 'job', 'email', 'password']
        # exclude = ['khonnect_id']

