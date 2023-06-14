from django.shortcuts import render
from .models import Game, GamesRecord
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from common.json import ModelEncoder
from accounts.models import User
import json

class GameEncoder(ModelEncoder):
    model = Game
    properties = [
        "name",
        "description",
        "rules"
    ]
    def get_extra_data(self, o):
        return {"gif": str(o.gif)}

class GamesRecordEncoder(ModelEncoder):
    model = GamesRecord
    properties = [
        "score",
        "game",
        "player"
    ]
    encoders = {
        "game": GameEncoder
    }


@require_http_methods(["GET", "POST"])
def api_list_games(request):
    if request.method == "GET":
        games = Game.objects.all()
        return JsonResponse(
            {"games": games},
            encoder=GameEncoder
        )
    else:
        content = json.loads(request.body)
        game = Game.objects.create(**content)
        return JsonResponse(
            {"game": game},
            encoder=GameEncoder,
            safe=False
        )


def api_show_game(request, name):
    game = Game.objects.filter(name=name)
    return JsonResponse(
        {"games": game},
        encoder=GameEncoder
    )

@require_http_methods(["GET", "POST"])
def api_list_games_records(request):
    if request.method == "GET":
        records = GamesRecord.objects.all()
        return JsonResponse(
            {"records": records},
            encoder=GamesRecordEncoder,
            safe=False
        )
    else:
        content = json.loads(request.body)
        game = Game.objects.get(id=content['game'])
        content['game'] = game
        print(request.user.username, " ______________________________________________")
        content['player'] = User.objects.get(id=request.user)
        record = GamesRecord.objects.create(**content)
        return JsonResponse(
            {"record": record},
            encoder=GamesRecordEncoder,
            safe=False
        )