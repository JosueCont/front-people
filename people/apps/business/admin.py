from django.contrib import admin
from people.apps.business.models import Node, NodePerson, Department, JobDepartment


@admin.register(Node)
class Node(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(NodePerson)
class NodePerson(admin.ModelAdmin):
    list_display = ('id', 'person', 'node')
    search_fields = ['node']
    list_filter = ('node',)


@admin.register(Department)
class Department(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(JobDepartment)
class JobDepartment(admin.ModelAdmin):
    list_display = ('id', 'job', 'department')
    search_fields = ['job', 'department']
    list_filter = ('job', 'department')
