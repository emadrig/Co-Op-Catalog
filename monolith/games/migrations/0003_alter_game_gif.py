# Generated by Django 4.2.2 on 2023-06-23 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0002_alter_game_gif'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='gif',
            field=models.CharField(max_length=100),
        ),
    ]