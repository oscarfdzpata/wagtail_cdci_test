from django.contrib.auth import authenticate, logout
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib import messages


def userRegister(request):
    form= CustomUserCreationForm()
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.email = user.username
            user.save()
            messages.success(request, 'Cuenta creada')
            return redirect('userManagement:register')
        else:
            print("F")
            print(form.errors)

    context = {
        'form': form
    }
    return render(request, 'userManagement/register_page.html',context)

from django.contrib.auth.decorators import login_required
@login_required(login_url='userManagement:register')
def userModify(request):
    form= CustomUserCreationForm()
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, instance=request.user)
        if form.is_valid():
            print("**************************************")
            # print(form)
            form.save()
            # messages.success(request, 'Cuenta modificada')
            return redirect('userManagement:modify')
        else:
            print("NO MODIFICADO")
            print("**************************************")
            # print(form)
            print(form.errors)

    context = {
        'form': form
    }
    return render(request, 'userManagement/modify_page.html',context)

from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import AuthenticationForm


def userLogIn(request):
    if request.user.is_authenticated:
        print("Ya has iniciado sesion")
        return redirect('/bienvenido-a-la-comunidad/')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = authenticate(request, username=username, password= password)
        except:
            user = authenticate(request, username=username, password= password)

        if user is not None:
            auth_login(request, user)
            return redirect('/bienvenido-a-la-comunidad/')
        else:
            messages.info(request,'Usuario o contraseña incorrectos')
            return redirect('userManagement:register')
       
    return  redirect('userManagement:register')


def userLogOut(request):
    logout(request)
    return redirect('userManagement:register')

@login_required(login_url='userManagement:register')
def userProfile(request):
    return render(request, 'userManagement/profile_page.html',{})