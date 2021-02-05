from django.contrib import admin

# Register your models here.
from people.apps.setup.models import Bank, Relationship, ExperienceType, ReasonSeparation, LaborRelationship, Treatment, \
    DocumentType


@admin.register(Bank)
class Bank(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(Relationship)
class Relationship(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(ExperienceType)
class ExperienceType(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(ReasonSeparation)
class ReasonSeparation(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(LaborRelationship)
class LaborRelationship(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(Treatment)
class Treatment(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(DocumentType)
class DocumentType(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ['name']
    list_filter = ('name',)
