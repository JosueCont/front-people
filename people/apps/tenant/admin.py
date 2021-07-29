from django.db import models
from django.contrib import admin
from django_tenants.admin import TenantAdminMixin

from people.apps.tenant.models import Client, Domain


@admin.register(Client)
class ClientAdmin(TenantAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'timestamp')


@admin.register(Domain)
class ClientAdmin(TenantAdminMixin, admin.ModelAdmin):
    list_display = ('domain', 'tenant', 'is_primary')
