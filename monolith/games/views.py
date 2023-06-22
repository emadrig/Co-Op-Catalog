from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import GameSerializer, GamesRecordSerializer
from .models import Game, GamesRecord


class GameList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GameDetail(APIView):
    def get(self, request, name):
        game = Game.objects.filter(name=name).first()
        if game:
            serializer = GameSerializer(game)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)


class GamesRecordList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = GamesRecord.objects.all()
        serializer = GamesRecordSerializer(records, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GamesRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(player=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GamesRecordByGame(APIView):
    def get(self, request, id):
        records = GamesRecord.objects.filter(game_id=id).order_by("-score")
        serializer = GamesRecordSerializer(records, many=True)
        return Response(serializer.data)


class GamesRecordByPlayer(APIView):
    def get(self, request, id):
        records = GamesRecord.objects.filter(player_id=id).order_by("-score")
        serializer = GamesRecordSerializer(records, many=True)
        return Response(serializer.data)
