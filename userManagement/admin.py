from django.contrib import admin

# Register your models here.
from .models import AppUser, UserTaste

admin.site.register(AppUser)
admin.site.register(UserTaste)