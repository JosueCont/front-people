from django.contrib import admin

from people.apps.person.models import Person, PersonType, Job, GeneralPerson


@admin.register(PersonType)
class PersonType(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(Job)
class Job(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(Person)
class Person(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']
    list_filter = ('name', )


@admin.register(GeneralPerson)
class GeneralPerson(admin.ModelAdmin):
    list_display = ('id', 'person')
    search_fields = ['person']
    list_filter = ('person',)
