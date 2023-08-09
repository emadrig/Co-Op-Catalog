import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.cache import cache
from ..models import BattleshipMatch, setup_game_board
import random


class BattleshipMatchConsumer(WebsocketConsumer):

    def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match']
        self.match_group_id = 'match_%s' % self.match_id
        # Join match group
        async_to_sync(self.channel_layer.group_add)(
            self.match_group_id,
            self.channel_name
        )

        self.match = BattleshipMatch.objects.get(id=self.match_id)

        # get current count of connected users or default to 0 if it doesn't exist
        count_of_connected_users = cache.get(self.match_id, 0)
        # increment the count of connected users
        cache.set(self.match_id, count_of_connected_users + 1)
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'player_one_board': self.match.player_one_board,
                'player_one_count': self.match.player_one_count,
                'player_two_board': self.match.player_two_board,
                'player_two_count': self.match.player_two_count,
                'current_player': 1,
                'winner': False
            }
        )
        self.accept()


    def disconnect(self, close_code):
        # Leave match group
        async_to_sync(self.channel_layer.group_discard)(
            self.match_group_id,
            self.channel_name
        )

        # decrease the count of connected users
        count_of_connected_users = cache.get(self.match_id, 0) - 1
        cache.set(self.match_id, count_of_connected_users)

        if count_of_connected_users == 0:
            BattleshipMatch.objects.filter(id=self.match_id).delete()
            self.match.player_one_board = None
            self.match.player_one_count = None
            self.match.player_two_board = None
            self.match.player_two_count = None
            self.match.current_player = None
            self.match.winner = None
            count_of_connected_users = None

        # Send message to match group
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'player_one_board': self.match.player_one_board,
                'player_one_count': self.match.player_one_count,
                'player_two_board': self.match.player_two_board,
                'player_two_count': self.match.player_two_count,
                'current_player': self.match.current_player,
                'winner': self.match.winner,
                'count_of_connected_users': count_of_connected_users
            }
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        print("this is text_data: ", text_data)
        text_data_json = json.loads(text_data)
        self.match = BattleshipMatch.objects.get(id=self.match_id)
        player_one_board = list(self.match.player_one_board)
        player_two_board = list(self.match.player_two_board)
        player_one_count = self.match.player_one_count
        player_two_count = self.match.player_two_count
        current_player = self.match.current_player
        winner = self.match.winner


        if text_data_json['type'] == 'reset_game_board':
            player_one_board = setup_game_board()
            player_one_count = {
                'A': 0,
                'B': 1,
                'C': 2,
                'D': 2,
                'E': 3,
                'sunk': 0
            }
            player_two_board = setup_game_board()
            player_two_count = {
                'A': 0,
                'B': 1,
                'C': 2,
                'D': 2,
                'E': 3,
                'sunk': 0
            }
            winner = False
            BattleshipMatch.objects.filter(id=self.match_id).update(
                player_one_board=player_one_board,
                player_one_count=player_one_count,
                player_two_board=player_two_board,
                player_two_count=player_two_count,
                winner=winner,
            )


        if text_data_json['type'] == 'move':
            index = text_data_json['index']
            row = 0
            remainder = 0
            if index <= 9:
                row = 0
                remainder = index
            else:
                row = index // 10
                remainder = index % 10

            if current_player == 1:
                board = player_two_board
            else:
                board = player_one_board

            char = board[row][remainder]

            if char.isalpha() and char != 'm':
                board[row][remainder] = char.lower()
                if current_player == 1:
                    player_two_count[char] += 1
                    if player_two_count[char] == 5:
                        player_two_count['sunk'] += 1
                    BattleshipMatch.objects.filter(id=self.match_id).update(player_two_board=board, player_two_count=player_two_count)

                else:
                    player_one_count[char] += 1
                    if player_one_count[char] == 5:
                        player_one_count['sunk'] += 1
                    BattleshipMatch.objects.filter(id=self.match_id).update(player_one_board=board, player_one_count=player_one_count)
            else:
                if current_player == 1:
                    board[row][remainder] = 'm'
                    BattleshipMatch.objects.filter(id=self.match_id).update(player_two_board=board)
                else:
                    board[row][remainder] = 'm'
                    BattleshipMatch.objects.filter(id=self.match_id).update(player_one_board=board)

            winner = player_one_count['sunk'] == 5 or player_two_count['sunk'] == 5
            self.match = BattleshipMatch.objects.get(id=self.match_id)
            player_one_board = list(self.match.player_one_board)
            player_two_board = list(self.match.player_two_board)
            current_player = self.match.current_player




            new_current_player = 2 if current_player == 1 else 1
            BattleshipMatch.objects.filter(id=self.match_id).update(current_player=new_current_player)
            match = BattleshipMatch.objects.get(id=self.match_id)
            current_player = match.current_player


        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'player_one_board': player_one_board,
                'player_one_count': player_one_count,
                'player_two_board': player_two_board,
                'player_two_count': player_two_count,
                'current_player': current_player,
                'winner': winner
            }
        )

    def chat_message(self, event):
        # Receive message from match group
        player_one_board = event['player_one_board']
        player_one_count = event['player_one_count']
        player_two_board = event['player_two_board']
        player_two_count = event['player_two_count']
        current_player = event['current_player']
        winner = event['winner']

        # get current count of connected users or default to 0 if it doesn't exist
        count_of_connected_users = cache.get(self.match_id, 0)
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'player_one_board': player_one_board,
            'player_one_count': player_one_count,
            'player_two_board': player_two_board,
            'player_two_count': player_two_count,
            'current_player': current_player,
            'winner': winner,
            'count_of_connected_users': count_of_connected_users
        }))