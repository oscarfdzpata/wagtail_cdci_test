# Generated by Django 3.2.13 on 2022-06-13 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userManagement', '0004_auto_20220613_1212'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='postal_code',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='historicalappuser',
            name='postal_code',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
