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
<<<<<<< HEAD
        fields = ['name', 'flast_name', 'mlast_name', 'birth_date', 'curp', 'rfc', 'imss', 'is_deleted', 'is_active', 'person_type', 'job', 'email', 'password']
        # exclude = ['khonnect_id']

=======
        # fields = "__all__"
        exclude = ['khonnect_id']


class AddressSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        fields = "__all__"


class TrainingSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Training
        fields = "__all__"


class BankSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Bank
        fields = "__all__"


class BankAccountSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.BankAccount
        fields = "__all__"
>>>>>>> 3e884152ef0041e00ce2f3774eecef8ddd60f66a
