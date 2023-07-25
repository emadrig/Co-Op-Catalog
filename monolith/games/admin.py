from django.contrib import admin
from .models import Game, PlayerHighScore, TicTacToeMatch, BattleshipMatch

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass

@admin.register(PlayerHighScore)
class PlayerHighScore(admin.ModelAdmin):
    pass

@admin.register(TicTacToeMatch)
class TicTacToeMatch(admin.ModelAdmin):
    pass

@admin.register(BattleshipMatch)
class BattleshipMatch(admin.ModelAdmin):
    pass