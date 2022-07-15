from django.urls import path

from .views import *

app_name= 'userManagement'
urlpatterns = [
    path('registro/', userRegister, name='register'),
    path('editar-perfil/', userModify, name='modify'),
    path('perfil/', userProfile, name='profile'),
    path('inicio/', userLogIn, name='login'),
    path('salir/', userLogOut, name='logout'),
    
]