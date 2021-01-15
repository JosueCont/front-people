from import_export import resources
from rest_framework import serializers
from people.apps.person import models
from people.apps.setup.models import Treatment
from people.apps.business.serializers import ChildNodeSerializer


class PersonTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PersonType
        fields = "__all__"


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Job
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(JobSerializer, self).to_representation(instance)
        representation['unit'] = ChildNodeSerializer(instance.unit, many=True).data
        return representation


class GeneralPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GeneralPerson
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(GeneralPersonSerializer, self).to_representation(instance)
        representation['person'] = PersonSerializer(instance.person).data
        return representation


class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Person
        # fields = "__all__"
        exclude = ['treatment']

    def to_representation(self, instance):
        representation = super(PersonSerializer, self).to_representation(instance)
        representation['treatment'] = TreatmentSerializer(instance.treatment).data
        representation['job'] = JobSerializer(instance.job).data
        representation['vacancy'] = VacancySerializer(models.Vacancy.objects.filter(users_applied__in=[instance.id]), many=True).data
        return representation


class VacancySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Vacancy
        fields = ["description", "job"]

    def to_representation(self, instance):
        representation = super(VacancySerializer, self).to_representation(instance)
        representation['job'] = JobSerializer(instance.job).data
        return representation


class TreatmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Treatment
        fields = "__all__"


class PersonCustomSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=40, required=False)
    groups = serializers.ListField(max_length=1000, required=False)

    class Meta:
        model = models.Person
        exclude = ['khonnect_id']

    def to_representation(self, instance):
        representation = super(PersonCustomSerializer, self).to_representation(instance)
        representation['treatment'] = TreatmentSerializer(instance.treatment).data
        representation['job'] = JobSerializer(instance.job).data
        return representation


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
        model = models.JobExperience
        fields = "__all__"


class BankAccountSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.BankAccount
        fields = "__all__"


class PersonResource(resources.ModelResource):
    class Meta:
        model = models.Person
        # fields = "__all__"
        exclude = ('id')
        import_id_fields = ('khonnect_id', 'name', 'flast_name', 'mlast_name', 'birth_date', 'curp', 'rfc', 'imss', 'is_deleted', 'is_active', 'person_type',  'job')
        export_id_fields = ('khonnect_id', 'name', 'flast_name', 'mlast_name', 'birth_date', 'curp', 'rfc', 'imss', 'is_deleted', 'is_active', 'person_type',  'job')

class DeletePersonMassiveSerializer(serializers.Serializer):
    """
    Serializer para eliminar varias personas
    """
    persons_id = serializers.CharField()