# Generated by Django 4.0.4 on 2022-05-27 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sabiasque', '0007_rename_article_articlepage'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlepage',
            name='hightlight',
            field=models.BooleanField(default=False),
        ),
    ]
