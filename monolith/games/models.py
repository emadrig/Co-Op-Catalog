from django.db import models
from django.conf import settings
from random_words import RandomWords, RandomEmails


class Game(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    rules = models.TextField()
    gif = models.CharField(max_length=100)
    multiplayer = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class PlayerHighScore(models.Model):
    score = models.IntegerField(default=1)

    game = models.ForeignKey(
        Game,
        related_name="player_high_score",
        on_delete=models.CASCADE
    )

    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='player_high_score',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.id)


class TicTacToeMatch(models.Model):
    state = models.CharField(max_length=10, default="nnnnnnnnn0")


class BattleshipMatch(models.Model):
    player_one_board = models.JSONField()
    player_two_board = models.JSONField()
