# Generated by Django 4.0.4 on 2022-05-27 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sabiasque', '0009_articlehightlight'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlehightlight',
            name='description',
            field=models.CharField(default='', max_length=400),
        ),
        migrations.AddField(
            model_name='articlehightlight',
            name='title',
            field=models.CharField(default='', max_length=200),
        ),
    ]
