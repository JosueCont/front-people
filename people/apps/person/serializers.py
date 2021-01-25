from import_export import resources
from rest_framework import serializers

from people.apps import business
from people.apps.person import models
from people.apps.setup.models import Treatment
from people.apps.business.serializers import ChildNodeSerializer, JobDepartmentSerializer, DepartmentSerializer
from people.apps.setup.serializers import BankSerializer, RelationshipSerializer, ExperienceTypeSerializer, \
    LaborRelationshipSerializer, ReasonSeparationSerializer


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
        representation['vacancy'] = VacancySerializer(models.Vacancy.objects.filter(users_applied__in=[instance.id]),
                                                      many=True).data
        representation['job_department'] = JobDepartmentSerializer(instance.job_department).data
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
        exclude = ['khonnect_id', 'treatment', 'job_department']

    def to_representation(self, instance):
        representation = super(PersonCustomSerializer, self).to_representation(instance)
        representation['treatment'] = TreatmentSerializer(instance.treatment).data
        representation['job_department'] = JobSerializer(instance.job_department).data
        return representation


class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Family
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(FamilySerializer, self).to_representation(instance)
        representation['relationship'] = RelationshipSerializer(instance.relationship).data
        representation['job'] = JobSerializer(instance.job).data
        return representation


class AddressSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        fields = "__all__"


class ContactEmergencySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContactEmergency
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(ContactEmergencySerializer, self).to_representation(instance)
        representation['relationship'] = RelationshipSerializer(instance.relationship).data
        return representation



class TrainingSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Training
        fields = "__all__"


class ExperienceJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.JobExperience
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(ExperienceJobSerializer, self).to_representation(instance)
        representation['experience_type'] = ExperienceTypeSerializer(instance.experience_type).data
        representation['labor_relationship'] = LaborRelationshipSerializer(instance.labor_relationship).data
        representation['reason_separation'] = ReasonSeparationSerializer(instance.reason_separation).data
        return representation


class BankAccountSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.BankAccount
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(BankAccountSerialiser, self).to_representation(instance)
        representation['bank'] = BankSerializer(instance.bank).data
        return representation


class PersonResource(resources.ModelResource):
    class Meta:
        model = models.Person
        # fields = "__all__"
        exclude = ('id')
        exclude = ('khonnect_id')
        #import_id_fields = ('first_name', 'flast_name', 'mlast_name', 'curp',)

        """export_id_fields = (
        'khonnect_id', 'name', 'flast_name', 'mlast_name', 'birth_date', 'curp', 'rfc', 'imss', 'is_deleted',
        'is_active', 'person_type', 'job')"""


class DeletePersonMassiveSerializer(serializers.Serializer):
    """
    Serializer para eliminar varias personas
    """
    persons_id = serializers.CharField()


class GetListPersonSerializer(serializers.Serializer):
    """
    Serializer para filtro de personas
    """
    first_name = serializers.CharField(required=False)
    gender = serializers.IntegerField(required=False)
    is_active = serializers.BooleanField()


class PhoneSerialiser(serializers.ModelSerializer):
    class Meta:
        model = models.Phone
        fields = "__all__"


class VacationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vacation
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(VacationSerializer, self).to_representation(instance)
        business = "N/A"
        if instance.person.job:
            if instance.person.job.unit.filter().exists():
                business = instance.person.job.unit.filter().first().name
        representation['collaborator'] = instance.person.full_name
        representation['business'] = business
        representation['department'] = "N/A"
        representation['available_days'] = 6
        return representation

