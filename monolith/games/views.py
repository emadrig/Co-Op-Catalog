from rest_framework.authentication import BasicAuthentication
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .models import Game, GamesRecord, TicTacToeMatch
from .serializers import GameSerializer, GamesRecordSerializer, TicTacToeMatchSerializer
from accounts.models import User
import jwt
from rest_framework_simplejwt.tokens import AccessToken


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def create(self, request):
        data = request.data
        game = Game.objects.create(**data)
        serializer = self.get_serializer(game)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='name', url_name='game_name')
    def get_by_name(self, request, pk=None):
        game = get_object_or_404(Game, name=pk)
        serializer = self.get_serializer(game)
        return Response(serializer.data)


class GamesRecordViewSet(viewsets.ModelViewSet):
    queryset = GamesRecord.objects.all()
    serializer_class = GamesRecordSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = (BasicAuthentication, )

    def create(self, request):
        token = request.headers['cookie'][17::]
        user_id = AccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg3ODIxODE3LCJpYXQiOjE2ODc4MjAwMTcsImp0aSI6IjllOTM2YjZhYzI2NTRmOWE5NGFkZGM1NGIwZDUwNjY5IiwidXNlcl9pZCI6Mn0.A_LEKbzdAzj6SMiQmbjQiDUA0gMcrMdU5w54SisHNy0')['user_id']
        data = request.data.copy()
        game = Game.objects.get(id=data['game'])
        data['game'] = game
        data['player'] = User.objects.get(id=user_id)
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