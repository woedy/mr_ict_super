from django.contrib import admin

from notifications.models import Announcement, Notification

admin.site.register(Notification)
admin.site.register(Announcement)
