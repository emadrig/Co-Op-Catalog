from django.db import models
from django.conf import settings

class Game(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    rules = models.TextField()
    gif = models.ImageField(upload_to="images/")

    def __str__(self):
        return self.name


class GamesRecord(models.Model):
    score = models.IntegerField()

    game = models.ForeignKey(
        Game,
        related_name="games_record",
        on_delete=models.CASCADE
    )

    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='games_record',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.id)