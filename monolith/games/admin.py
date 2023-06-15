from django.contrib import admin
from .models import Game, GamesRecord

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass

@admin.register(GamesRecord)
class GamesRecord(admin.ModelAdmin):
    pass