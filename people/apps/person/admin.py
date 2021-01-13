from django.contrib import admin

from people.apps.person.models import Person, PersonType, Job, GeneralPerson, Address, Training, BankAccount, \
    Family, ContactEmergency, JobExperience, Phone, Vacancy


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
    list_display = ('id', 'first_name')
    search_fields = ['first_name']
    list_filter = ('first_name', )


@admin.register(GeneralPerson)
class GeneralPerson(admin.ModelAdmin):
    list_display = ('id', 'person')
    search_fields = ['person']
    list_filter = ('person',)


@admin.register(Family)
class Family(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']
    list_filter = ('name',)


@admin.register(ContactEmergency)
class ContactEmergency(admin.ModelAdmin):
    list_display = ('id', 'fullname')
    search_fields = ['fullname']
    list_filter = ('fullname',)


@admin.register(JobExperience)
class JobExperience(admin.ModelAdmin):
    list_display = ('id', 'function')
    search_fields = ['function']
    list_filter = ('function',)


@admin.register(Address)
class Address(admin.ModelAdmin):
    list_display = ('id', 'street', 'person')
    search_fields = ['person']
    list_filter = ('person',)


@admin.register(Phone)
class Phone(admin.ModelAdmin):
    list_display = ('id', 'person')
    search_fields = ['person']
    list_filter = ('person',)


@admin.register(Training)
class Training(admin.ModelAdmin):
    list_display = ('id', 'school')
    search_fields = ['person']
    list_filter = ('person',)


@admin.register(BankAccount)
class BankAccount(admin.ModelAdmin):
    list_display = ('id', 'account_number')
    search_fields = ['bank']
    list_filter = ('bank',)


@admin.register(Vacancy)
class Vacancy(admin.ModelAdmin):
    pass
