from django.urls import path
from .views import api_list_games, api_show_game, api_list_games_records

urlpatterns = [
    path("games/", api_list_games, name='api_list_games'),
    path("games/<str:name>/", api_show_game, name="api_show_game"),
    path("gamerecords/", api_list_games_records, name="api_list_games_records"),
]
