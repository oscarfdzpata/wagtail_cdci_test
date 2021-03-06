# Generated by Django 3.2.13 on 2022-06-13 10:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailimages', '0023_add_choose_permissions'),
        ('studies', '0004_studiespage_icon_studiespagegalleryimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studiesindexpage',
            name='image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.image'),
        ),
    ]
