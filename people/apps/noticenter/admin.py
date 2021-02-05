from django.contrib import admin
from .models import Notification, UserNotification

# Register your models here.


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    pass


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    pass

