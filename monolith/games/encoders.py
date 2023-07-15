from common.json import ModelEncoder
from .models import Game, PlayerHighScore
from accounts.models import User

class UserEncoder(ModelEncoder):
    model = User
    properties = ["username"]

class GameEncoder(ModelEncoder):
    model = Game
    properties = [
        "name",
        "description",
        "rules",
        "id",
    ]

    def get_extra_data(self, o):
        return {"gif": str(o.gif)}

class PlayerHighScoreEncoder(ModelEncoder):
    model = PlayerHighScore
    properties = [
        "score",
        "player",
        "game",
    ]
    encoders = {
        "player": UserEncoder(),
        "game": GameEncoder(),
    }