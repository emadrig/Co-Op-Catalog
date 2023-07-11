from django.contrib import admin
from .models import Game, GamesRecord, TicTacToeMatch

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass

@admin.register(GamesRecord)
class GamesRecord(admin.ModelAdmin):
    pass

@admin.register(TicTacToeMatch)
class TicTacToeMatch(admin.ModelAdmin):
    pass