# Generated by Django 3.1.3 on 2020-11-08 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0004_auto_20201108_1349'),
    ]

    operations = [
        migrations.AddField(
            model_name='education',
            name='course_time',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
