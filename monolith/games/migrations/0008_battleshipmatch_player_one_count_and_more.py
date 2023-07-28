# Generated by Django 4.2.2 on 2023-07-27 23:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0007_battleshipmatch_winner'),
    ]

    operations = [
        migrations.AddField(
            model_name='battleshipmatch',
            name='player_one_count',
            field=models.JSONField(default={'A': 0, 'B': 1, 'C': 2, 'D': 2, 'E': 3, 'sunk': 0}),
        ),
        migrations.AddField(
            model_name='battleshipmatch',
            name='player_two_count',
            field=models.JSONField(default={'A': 0, 'B': 1, 'C': 2, 'D': 2, 'E': 3, 'sunk': 0}),
        ),
        migrations.AlterField(
            model_name='battleshipmatch',
            name='player_one_board',
            field=models.JSONField(default=[[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', 'A', ' ', 'E', 'E', ' ', ' ', ' ', ' '], [' ', ' ', 'A', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', 'A', ' ', ' ', 'D', 'D', 'D', ' ', ' '], [' ', ' ', 'A', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', 'A', ' ', ' ', 'C', 'C', 'C', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', 'B', 'B', 'B', 'B', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]),
        ),
        migrations.AlterField(
            model_name='battleshipmatch',
            name='player_two_board',
            field=models.JSONField(default=[[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', 'C', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', 'C', ' ', ' ', ' ', 'B', ' ', 'A', ' '], [' ', ' ', 'C', ' ', 'D', ' ', 'B', ' ', 'A', ' '], [' ', ' ', ' ', ' ', 'D', ' ', 'B', ' ', 'A', ' '], [' ', ' ', ' ', ' ', 'D', ' ', 'B', ' ', 'A', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A', ' '], [' ', 'E', 'E', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]),
        ),
    ]
