#Django
from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import IntegerField
from modelcluster.fields import ParentalKey
# from .forms import CustomUserCreationForm

#Wagtail
from wagtail.core.models import Page, Orderable
#Form
from wagtail.admin.edit_handlers import (
    FieldPanel, FieldRowPanel,
    InlinePanel, MultiFieldPanel
)
from wagtail.core.fields import RichTextField
from wagtail.contrib.forms.models import AbstractEmailForm, AbstractFormField
### 

#History
from simple_history.models import HistoricalRecords

class UserTaste(models.Model):
    TASTE_CHOICES = [
    ('0', 'Conservas de pescado'),
    ('1', 'Aceite'),
    ('2', 'Panaderia y pastelería'),
    ('4', 'Conservas'),
    ('5', 'Cacao y confiteria'),
    ('6', 'Café e infusiones'),
    ('7', 'Pescados y crustáceos'),
    ('8', 'Quesos'),
    ]
    taste =models.CharField(
        max_length=2,
        choices=TASTE_CHOICES,
        blank = True, null = True
    )
    icon = models.ImageField(
        upload_to="user_taste",
        max_length=255,
        verbose_name="Gustos del usuario",
        null=True,
        blank=True,
        )
    def __str__(self):
        return self.get_taste_display()

class AppUser(AbstractUser):
    GENDER_CHOICES = [
    ('hombre', 'Hombre'),
    ('mujer', 'Mujer'),
    ]
    gender = models.CharField(
        max_length=6,
        choices=GENDER_CHOICES,
    )
    birth_date = models.DateField(blank = True, null = True)
    country = models.CharField(verbose_name ='País', max_length = 255)
    province = models.CharField(verbose_name ='Provincia', max_length = 255)
    city = models.CharField(verbose_name ='Ciudad', max_length = 255)
    address = models.CharField(verbose_name ='Dirección', max_length = 255, blank = True, null = True)
    postal_code = models.IntegerField(blank = True, null = True)
    phone =models.IntegerField(blank = True, null = True)
    profile_picture = models.FileField(blank = True, null = True)
    taste = models.ManyToManyField(
        UserTaste,  
        related_name="%(class)s", 
        blank=True,
        )
    
    
    extra_info = models.TextField(blank = True, null = True)
    wantsToParticipateInOnlineConsumerStudies = models.BooleanField(default=True)
    wantsToParticipateInOnSiteConsumerStudies = models.BooleanField(default=True)
    history = HistoricalRecords()
    points = models.IntegerField(default=0)


