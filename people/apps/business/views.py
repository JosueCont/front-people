from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from people.apps.business import serializers
from people.apps.business.models import Node, NodePerson, Department, JobDepartment, Job
from people.apps.person.serializers import JobSerializer


class NodeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.NodeSerializer
    queryset = Node.objects.all()
    filterset_fields = ('id', 'name')

    @action(detail=True, methods=['get'])
    def department_for_node(self, request, pk):
        if pk:
            try:
                node = self.get_object()
                departments_id = JobDepartment.objects.filter(job__unit__id__in=[node.id]).values_list('department_id', flat=True)
                department = Department.objects.filter(id__in=departments_id)
                data = serializers.DepartmentSerializer(department, many=True).data
                return Response(data=data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'])
    def node_in_cascade(self, request, pk=None):
        pk = request.POST.get('pk', None)
        if pk:
            root_node = Node.objects.get(id=pk)
        else:
            root_node = Node.objects.filter(parent__isnull=True).first()
        json_nodes = {}
        json_nodes["value"] = root_node.id
        json_nodes["label"] = root_node.name
        result = Node.traverse_node_json(root_node)
        json_nodes["children"] = result
        return Response(json_nodes)



class NodePersonViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.NodePersonSerializer
    queryset = NodePerson.objects.all()
    filterset_fields = ('id',)


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DepartmentSerializer
    queryset = Department.objects.all()
    filterset_fields = ('id', 'name')

    @action(detail=True, methods=['get'])
    def job_for_department(self, request, pk):

        if pk:
            try:
                department = self.get_object()
                job_department = JobDepartment.objects.filter(department=department)
                array_jobs = []
                if job_department:
                    for job in job_department:
                        array_jobs.append(JobSerializer(job.job).data)
                return Response(data=array_jobs, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': 'No se encontraron datos'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"id requerido"}, status=status.HTTP_400_BAD_REQUEST)


class JobDepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.JobDepartmentSerializer
    queryset = JobDepartment.objects.all()
    filterset_fields = ('id',)
