# Generated by Django 4.2.2 on 2023-07-25 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0005_alter_battleshipmatch_player_one_board_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='battleshipmatch',
            name='current_player',
            field=models.IntegerField(default=1),
        ),
    ]