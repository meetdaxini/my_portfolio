# Generated by Django 3.1.3 on 2020-11-05 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('demo_link', models.URLField(null=True)),
                ('github_link', models.URLField(null=True)),
                ('img', models.ImageField(upload_to='portfolio/images/')),
            ],
        ),
    ]
