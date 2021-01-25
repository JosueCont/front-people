from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from people.apps.business import serializers
from people.apps.business.models import Node, NodePerson, Department, JobDepartment
from people.apps.person.serializers import JobSerializer


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

    @action(detail=True, methods=['get'])
    def job_for_department(self, request, pk):

        if pk:
            try:
                department = self.get_object()
                job_department = JobDepartment.objects.filter(department=department)
                if job_department:
                    array_jobs = []
                    for job in job_department:
                        array_jobs.append(JobSerializer(job.job).data)
                return Response(data=array_jobs, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, tatus=status.HTTP_400_BAD_REQUEST)


class JobDepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.JobDepartmentSerializer
    queryset = JobDepartment.objects.all()
    filterset_fields = ('id',)
