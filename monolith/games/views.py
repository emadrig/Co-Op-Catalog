from rest_framework.authentication import BasicAuthentication
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .models import Game, GamesRecord, TicTacToeMatch
from .serializers import GameDetailSerializer, GameListSerializer, GamesRecordSerializer, TicTacToeMatchSerializer
from accounts.models import User
import jwt
from rest_framework_simplejwt.tokens import AccessToken


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


class GamesRecordViewSet(viewsets.ModelViewSet):
    queryset = GamesRecord.objects.all()
    serializer_class = GamesRecordSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = (BasicAuthentication, )

    def create(self, request):
        data = request.data.copy()
        game = Game.objects.get(id=data['game'])
        data['game'] = game
        user = User.objects.get(id=data['user'])
        data['player'] = user
        del data['user']
        record = GamesRecord.objects.create(**data)
        serializer = self.get_serializer(record)
        return Response({"record": serializer.data})

    @action(detail=True, methods=['get'], url_path='game', url_name='gamerecords_name' )
    def list_by_game(self, request, pk=None):
        records = GamesRecord.objects.filter(game_id=pk).order_by("-score")
        serializer = self.get_serializer(records, many=True)
        return Response({"records": serializer.data})

    @action(detail=True, methods=['get'])
    def list_by_player(self, request, pk=None):
        records = GamesRecord.objects.filter(player_id=pk).order_by("-score")
        serializer = self.get_serializer(records, many=True)
        return Response({"records": serializer.data})


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