from django.contrib import admin

# Register your models here.
from people.apps.setup.models import Bank, Relationship, ExperienceType, ReasonSeparation, LaborRelationship


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


