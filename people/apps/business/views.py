from django.shortcuts import render
from rest_framework import viewsets
from people.apps.business import serializers
from people.apps.business.models import Node, NodePerson, Department, JobDepartment


class NodeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.NodeSerializer
    queryset = Node.objects.all()
    filterset_fields = ('id', 'name')


class NodePersonViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.NodePersonSerializer
    queryset = NodePerson.objects.all()
    filterset_fields = ('id',)


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DepartmentSerializer
    queryset = Department.objects.all()
    filterset_fields = ('id',)


class JobDepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.JobDepartmentSerializer
    queryset = JobDepartment.objects.all()
    filterset_fields = ('id',)
