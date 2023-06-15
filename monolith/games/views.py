from .models import Game, GamesRecord
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from accounts.models import User
from .encoders import GameEncoder, GamesRecordEncoder
import json



@login_required
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
        {"game": game},
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
        user = User.objects.get(username=request.user.username)
        content['player'] = user
        record = GamesRecord.objects.create(**content)
        return JsonResponse(
            {"record": record},
            encoder=GamesRecordEncoder,
            safe=False
        )


def api_list_game_records_by_game(request, id):
    records = GamesRecord.objects.filter(game_id=id).order_by("-score")
    return JsonResponse(
        {"records": records},
        encoder=GamesRecordEncoder,
        safe=False,
    )

def api_list_game_records_by_player(request, id):
    records = GamesRecord.objects.filter(player_id=id).order_by("-score")
    return JsonResponse(
        {"records": records},
        encoder=GamesRecordEncoder,
        safe=False,
    )