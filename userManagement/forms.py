from calendar import calendar
from tkinter.tix import Form
from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import  UserCreationForm 
from pkg_resources import require
from .models import AppUser
from django.contrib.auth import get_user_model
User = get_user_model()

class CustomUserCreationForm(forms.ModelForm):
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
    GENDER_CHOICES = [
    ('hombre', 'Hombre'),
    ('mujer', 'Mujer'),
    ]
    username =  forms.EmailField(required=True, label=_("Correo electrónico"))
    password1= forms.CharField(required=True,label=_("Contraseña"), widget=forms.PasswordInput)
    password2 = forms.CharField(required=True,label=_("Confirmar contraseña"), widget=forms.PasswordInput)
    first_name = forms.CharField(required=True,label=_("Nombre"))
    last_name = forms.CharField(required=True,label=_("Apellidos"))
    gender = forms.CharField(required=True, label=_("Sexo"), widget= forms.Select(choices=GENDER_CHOICES),)
    birth_date = forms.DateField(required=True,label=_("Fecha de nacimiento"))
    country = forms.CharField(required=False, label=_("País"))
    province = forms.CharField(required=False, label=_("Provincia"))
    city = forms.CharField(required=False, label=_("Ciudad"))
    address = forms.CharField(required=False, label=_("Dirección"))
    postal_code = forms.IntegerField(required=False, label=_("Código postal"))
    phone = forms.IntegerField(required=False, label=_("Teléfono"))
    profile_picture = forms.FileField(required=False, label=_("Foto de perfil"))
    taste = forms.CharField(required=False, label=_("Gustos"), widget=  forms.Select(choices=TASTE_CHOICES),)
    extra_info = forms.CharField(required=False, label=_("¿Quieres contarnos algo más?"))
    wantsToParticipateInOnlineConsumerStudies = forms.BooleanField(required=False,label=_("Me gustaría participar en estudios de consumo on-line"))
    wantsToParticipateInOnSiteConsumerStudies = forms.BooleanField(required=False,label=_("Me gustaría participar en estudios de consumo presenciales"))

    class Meta: 
        model = AppUser
        fields=('username','password1', 'password2','first_name','last_name', 'gender',  'birth_date', 'country','province','city','address','postal_code','phone','profile_picture','taste', 'extra_info', 'wantsToParticipateInOnlineConsumerStudies', 'wantsToParticipateInOnSiteConsumerStudies' )

   

class CustomUserCreationForm(UserCreationForm):
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
    GENDER_CHOICES = [
    ('hombre', 'Hombre'),
    ('mujer', 'Mujer'),
    ]
    username =  forms.EmailField(required=True, label=_("Correo electrónico"))
    password1= forms.CharField(required=True,label=_("Contraseña"), widget=forms.PasswordInput)
    password2 = forms.CharField(required=True,label=_("Confirmar contraseña"), widget=forms.PasswordInput)
    first_name = forms.CharField(required=False,label=_("Nombre"))
    last_name = forms.CharField(required=False,label=_("Apellidos"))
    gender = forms.CharField(required=False, label=_("Sexo"), widget= forms.Select(choices=GENDER_CHOICES),)
    birth_date = forms.DateField(required=False,label=_("Fecha de nacimiento"))
    country = forms.CharField(required=False, label=_("País"))
    province = forms.CharField(required=False, label=_("Provincia"))
    city = forms.CharField(required=False, label=_("Ciudad"))
    address = forms.CharField(required=False, label=_("Dirección"))
    postal_code = forms.IntegerField(required=False, label=_("Código postal"))
    phone = forms.IntegerField(required=False, label=_("Teléfono"))
    profile_picture = forms.FileField(required=False, label=_("Foto de perfil"))
    taste = forms.CharField(required=False, label=_("Gustos"), widget=  forms.Select(choices=TASTE_CHOICES),)
    extra_info = forms.CharField(required=False, label=_("¿Quieres contarnos algo más?"))
    wantsToParticipateInOnlineConsumerStudies = forms.BooleanField(required=False,label=_("Me gustaría participar en estudios de consumo on-line"))
    wantsToParticipateInOnSiteConsumerStudies = forms.BooleanField(required=False,label=_("Me gustaría participar en estudios de consumo presenciales"))

    class Meta: 
        model = AppUser
        fields=('username','password1', 'password2','first_name','last_name', 'gender',  'birth_date', 'country','province','city','address','postal_code','phone','profile_picture','taste', 'extra_info', 'wantsToParticipateInOnlineConsumerStudies', 'wantsToParticipateInOnSiteConsumerStudies' )

   