from django.contrib import admin

from people.apps.person.models import Person, PersonType, Job, GeneralPerson, Address, Training, Bank, BankAccount


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


@admin.register(Address)
class Address(admin.ModelAdmin):
    list_display = ('id', 'person')
    search_fields = ['person']
    list_filter = ('person',)


@admin.register(Training)
class Training(admin.ModelAdmin):
    list_display = ('id', 'person')
    search_fields = ['person']
    list_filter = ('person',)


@admin.register(Bank)
class Training(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(BankAccount)
class Training(admin.ModelAdmin):
    list_display = ('id', 'accountNumber')
    search_fields = ['bank']
    list_filter = ('bank',)
