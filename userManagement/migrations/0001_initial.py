# Generated by Django 4.0.5 on 2022-06-07 16:11

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('gender', models.CharField(choices=[('hombre', 'Hombre'), ('mujer', 'Mujer')], max_length=6)),
                ('birth_date', models.DateField(blank=True, null=True)),
                ('country', models.CharField(max_length=255, verbose_name='Pa??s')),
                ('province', models.CharField(max_length=255, verbose_name='Provincia')),
                ('city', models.CharField(max_length=255, verbose_name='Ciudad')),
                ('address', models.CharField(blank=True, max_length=255, null=True, verbose_name='Direcci??n')),
                ('postal_code', models.IntegerField(blank=True, max_length=10, null=True)),
                ('phone', models.IntegerField(blank=True, max_length=9, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='')),
                ('extra_info', models.TextField(blank=True, null=True)),
                ('wantsToParticipateInOnlineConsumerStudies', models.BooleanField(default=True)),
                ('wantsToParticipateInOnSiteConsumerStudies', models.BooleanField(default=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UserTaste',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('taste', models.CharField(blank=True, choices=[('0', 'Conservas de pescado'), ('1', 'Aceite'), ('2', 'Panaderia y pasteler??a'), ('4', 'Conservas'), ('5', 'Cacao y confiteria'), ('6', 'Caf?? e infusiones'), ('7', 'Pescados y crust??ceos'), ('8', 'Quesos')], max_length=2, null=True)),
                ('icon', models.ImageField(blank=True, max_length=255, null=True, upload_to='user_taste', verbose_name='Gustos del usuario')),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalAppUser',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(db_index=True, error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('gender', models.CharField(choices=[('hombre', 'Hombre'), ('mujer', 'Mujer')], max_length=6)),
                ('birth_date', models.DateField(blank=True, null=True)),
                ('country', models.CharField(max_length=255, verbose_name='Pa??s')),
                ('province', models.CharField(max_length=255, verbose_name='Provincia')),
                ('city', models.CharField(max_length=255, verbose_name='Ciudad')),
                ('address', models.CharField(blank=True, max_length=255, null=True, verbose_name='Direcci??n')),
                ('postal_code', models.IntegerField(blank=True, max_length=10, null=True)),
                ('phone', models.IntegerField(blank=True, max_length=9, null=True)),
                ('profile_picture', models.TextField(blank=True, max_length=100, null=True)),
                ('extra_info', models.TextField(blank=True, null=True)),
                ('wantsToParticipateInOnlineConsumerStudies', models.BooleanField(default=True)),
                ('wantsToParticipateInOnSiteConsumerStudies', models.BooleanField(default=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical user',
                'verbose_name_plural': 'historical users',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.AddField(
            model_name='appuser',
            name='taste',
            field=models.ManyToManyField(blank=True, null=True, related_name='%(class)s', to='userManagement.usertaste'),
        ),
        migrations.AddField(
            model_name='appuser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
