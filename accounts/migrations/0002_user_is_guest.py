# Generated by Django 4.2.2 on 2023-06-14 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_guest",
            field=models.BooleanField(default=False),
        ),
    ]