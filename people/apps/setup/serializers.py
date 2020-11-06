from rest_framework import serializers

from people.apps.setup import models


class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Relationship
        fields = "__all__"


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Bank
        fields = "__all__"


class ExperienceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExperienceType
        fields = "__all__"


class ReasonSeparationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ReasonSeparation
        fields = "__all__"


class LaborRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ReasonSeparation
        fields = "__all__"
