from django.urls import path
from .views import api_list_games

urlpatterns = [
    path("games/", api_list_games, name='api_list_games')
]
