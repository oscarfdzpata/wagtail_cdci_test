from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import AppUser
# @receiver(post_save, sender=AppUser)
# def post_save_create_file(sender, instance, created, **kwargs):

#     if created:
#         print("holi")
#         print(instance.username)

#         instance.username = instance.email
#         print(instance.username)

#         instance.save()
#         print(instance.username)