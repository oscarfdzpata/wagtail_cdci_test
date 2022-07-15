# Generated by Django 3.2.13 on 2022-06-13 10:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailimages', '0023_add_choose_permissions'),
        ('studies', '0005_alter_studiesindexpage_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studiespage',
            name='icon',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='wagtailimages.image'),
        ),
    ]
