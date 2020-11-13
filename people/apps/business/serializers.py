from people.apps.business import models
from people.apps.setup import serializers


class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Node
        fields = "__all__"


class NodePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NodePerson
        fields = "__all__"