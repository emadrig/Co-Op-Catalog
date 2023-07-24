import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.cache import cache
from ..models import BattleshipMatch

class BattleshipMatchConsumer(WebsocketConsumer):
    pass