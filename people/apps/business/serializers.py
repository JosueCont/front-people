from people.apps.business import models
from rest_framework import serializers


class ChildNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Node
        fields = "__all__"


class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Node
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(NodeSerializer, self).to_representation(instance)
        if instance.parent:
            representation['parent'] = ChildNodeSerializer(instance=instance.parent).data
        return representation


class NodePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NodePerson
        fields = "__all__"


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Department
        fields = "__all__"


class JobDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.JobDepartment
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(JobDepartmentSerializer, self).to_representation(instance)
        from people.apps.person.serializers import JobSerializer
        representation['job'] = JobSerializer(instance.job).data
        representation['department'] = DepartmentSerializer(instance.department).data
        return representation
