from django.urls import path
from .views import api_list_games, api_show_game

urlpatterns = [
    path("games/", api_list_games, name='api_list_games'),
    path("games/<str:name>", api_show_game, name="api_show_game"),
]
