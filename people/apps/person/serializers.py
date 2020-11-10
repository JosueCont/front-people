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
        # fields = "__all__"
        exclude = ['khonnect_id']


class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Family
        fields = "__all__"


class AddressSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        fields = "__all__"


class ContactEmergencySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContactEmergency
        fields = "__all__"


class TrainingSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Training
        fields = "__all__"


class ExperienceJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExperienceJob
        fields = "__all__"


class BankAccountSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.BankAccount
        fields = "__all__"

