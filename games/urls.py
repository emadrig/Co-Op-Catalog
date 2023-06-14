from django.urls import path
from .views import api_list_games, api_show_game, api_list_games_records, api_list_game_records_by_game, api_list_game_records_by_player

urlpatterns = [
    path("gamerecords/player/<int:id>/", api_list_game_records_by_player, name="api_list_game_records_by_player"),
    path("gamerecords/game/<int:id>/", api_list_game_records_by_game, name="api_list_games_by_game"),
    path("gamerecords/", api_list_games_records, name="api_list_games_records"),
    path("games/list", api_list_games, name='api_list_games'),
    path("<str:name>/", api_show_game, name="api_show_game"),
]
