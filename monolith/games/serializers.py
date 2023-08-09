from accounts.models import User
from .models import Game, PlayerHighScore, TicTacToeMatch, BattleshipMatch
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class GameDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = [
            'name',
            'description',
            'rules',
            'id',
            'picture_1',
            'picture_2',
            'picture_3',
            'picture_4',
            'multiplayer'
        ]

class GameListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = [
            'name',
            'id',
            'picture_1'
        ]

class PlayerHighScoreSerializer(serializers.HyperlinkedModelSerializer):
    player = UserSerializer()
    game = GameListSerializer()

    class Meta:
        model = PlayerHighScore
        fields = [
            'score',
            'player',
            'game',
            'id'
        ]

class TicTacToeMatchSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TicTacToeMatch
        fields = [
            'state',
            'id'
        ]

class BattleshipMatchSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BattleshipMatch
        fields = [
            'player_one_board',
            'player_two_board',
            'id',
        ]