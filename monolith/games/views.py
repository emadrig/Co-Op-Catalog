from rest_framework.authentication import BasicAuthentication
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .models import Game, PlayerHighScore, TicTacToeMatch, BattleshipMatch
from .serializers import GameDetailSerializer, GameListSerializer, PlayerHighScoreSerializer, TicTacToeMatchSerializer, BattleshipMatchSerializer
from accounts.models import User


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameListSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def create(self, request):
        data = request.data
        game = Game.objects.create(**data)
        serializer = GameDetailSerializer(game)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='name', url_name='game_name')
    def get_by_name(self, request, pk=None):
        game = get_object_or_404(Game, name=pk)
        serializer = GameDetailSerializer(game)
        return Response(serializer.data)


class PlayerHighScoreViewSet(viewsets.ModelViewSet):
    queryset = PlayerHighScore.objects.all()
    serializer_class = PlayerHighScoreSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = (BasicAuthentication, )

    def create(self, request):
        data = request.data.copy()
        game = Game.objects.get(id=data['game'])
        data['game'] = game
        user = User.objects.get(id=data['user'])
        data['player'] = user
        del data['user']
        high_score = PlayerHighScore.objects.filter(player=user.id, game=game.id)

        if high_score.exists() and high_score[0].game.multiplayer:
            high_score = high_score[0]
            high_score.score += 1
            high_score.save()
            serializer = self.get_serializer(high_score)
            return Response(serializer.data)
        else:
            high_score = PlayerHighScore.objects.create(**data)
            serializer = self.get_serializer(high_score)
            return Response(serializer.data)


    @action(detail=True, methods=['get'], url_path='game', url_name='high-score_name' )
    def list_by_game(self, request, pk=None):
        high_scores = PlayerHighScore.objects.filter(game_id=pk).order_by("-score")
        serializer = self.get_serializer(high_scores, many=True)
        return Response({"high_scores": serializer.data})

    @action(detail=True, methods=['get'], url_path='player', url_name='high-score_name' )
    def list_by_player(self, request, pk=None):
        high_scores = PlayerHighScore.objects.filter(player_id=pk).order_by("-score")
        serializer = self.get_serializer(high_scores, many=True)
        return Response({"high_scores": serializer.data})


class TicTacToeMatchViewSet(viewsets.ModelViewSet):
    queryset = TicTacToeMatch.objects.all()
    serializer_class = TicTacToeMatchSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        match = TicTacToeMatch.objects.create(state='nnnnnnnnn0')
        serializer = self.get_serializer(match)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='match', url_name='match_id')
    def get_by_id(self, request, pk=None):
        match = get_object_or_404(TicTacToeMatch, id=pk)
        serializer = self.get_serializer(match)
        return Response(serializer.data)


class BattleshipMatchViewSet(viewsets.ModelViewSet):
    queryset = BattleshipMatch.objects.all()
    serializer_class = BattleshipMatchSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        match = BattleshipMatch.objects.create()
        serializer = self.get_serializer(match)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='match', url_name='match_id')
    def get_by_id(self, request, pk=None):
        match = get_object_or_404(BattleshipMatch, id=pk)
        serializer = self.get_serializer(match)
        return Response(serializer.data)