import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.cache import cache
from ..models import BattleshipMatch
import random


def setup_game_board():
    board = [['.']*10 for _ in range(10)]

    def place_ship(board, ship, ship_char):
        placed = False
        while not placed:
            orientation = random.choice(['H', 'V'])
            if orientation == 'H':
                start_x = random.randint(1, 10 - ship - 2)
                start_y = random.randint(1, 10 - 2)
                # check ship and surrounding area
                if all(board[start_y + dy][start_x + dx] == '.' for dy in range(-1, 2) for dx in range(-1, ship + 2)):
                    for i in range(ship):
                        board[start_y][start_x+i] = ship_char
                    placed = True
            elif orientation == 'V':
                start_x = random.randint(1, 10 - 2)
                start_y = random.randint(1, 10 - ship - 2)
                # check ship and surrounding area
                if all(board[start_y + dy][start_x + dx] == '.' for dy in range(-1, ship + 2) for dx in range(-1, 2)):
                    for i in range(ship):
                        board[start_y+i][start_x] = ship_char
                    placed = True
        return board


    # board = [['.']*10 for _ in range(10)]
    board = place_ship(board, 5, 'A')
    board = place_ship(board, 4, 'B')
    board = place_ship(board, 3, 'C')
    board = place_ship(board, 3, 'D')
    board = place_ship(board, 2, 'E')

    return board


class BattleshipMatchConsumer(WebsocketConsumer):

    def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match']
        self.match_group_id = 'match_%s' % self.match_id
        # Join match group
        async_to_sync(self.channel_layer.group_add)(
            self.match_group_id,
            self.channel_name
        )

        board1 = setup_game_board()
        board2 = setup_game_board()

        BattleshipMatch.objects.filter(id=self.match_id).update(player_one_board=board1)
        BattleshipMatch.objects.filter(id=self.match_id).update(player_two_board=board2)
        match = BattleshipMatch.objects.get(id=self.match_id)

        print('match: ', match)

        # get current count of connected users or default to 0 if it doesn't exist
        count_of_connected_users = cache.get(self.match_id, 0)
        # increment the count of connected users
        cache.set(self.match_id, count_of_connected_users + 1)
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'player_one_board': match.player_one_board,
                'player_two_board': match.player_two_board,
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

        # Send message to match group
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'player_one_board': BattleshipMatch.objects.get(id=self.match_id).player_one_board,
                'player_two_board': BattleshipMatch.objects.get(id=self.match_id).player_two_board,
                'current_player': BattleshipMatch.objects.get(id=self.match_id).current_player,
                'winner': BattleshipMatch.objects.get(id=self.match_id).winner,
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
        current_player = self.match.current_player
        winner = self.match.winner
        if text_data_json['type'] == 'reset_game_board':
            player_one_board = ['          '] * 10
            player_two_board = ['          '] * 10
            BattleshipMatch.objects.filter(id=self.match_id).update(player_one_board=player_one_board, player_two_board=player_two_board)
        if text_data_json['type'] == 'move':
            new_current_player = 2 if current_player == 1 else 1
            BattleshipMatch.objects.filter(id=self.match_id).update(current_player=new_current_player)
            match = BattleshipMatch.objects.get(id=self.match_id)
            current_player = match.current_player
            print('current_player', current_player)
            print(text_data_json['index'])
            # idx = text_data_json['index']
            # state[idx] = letter
            # winner = self.check_for_winner(state)
            # if winner:
            #     state.append("W")
            #     new_state = "".join(state)
            #     BattleshipMatch.objects.filter(id=self.match_id).update(state=new_state)
            #     update_match = BattleshipMatch.objects.get(id=self.match_id)
            # else:
            #     player = "1" if player == "0" else "0"
            #     state[9] = player
            #     new_state = "".join(state)
            #     BattleshipMatch.objects.filter(id=self.match_id).update(state=new_state)
            #     update_match = BattleshipMatch.objects.get(id=self.match_id)
        # else:
        #     update_match = BattleshipMatch.objects.get(id=self.match_id)

        # Send message to match group
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'player_one_board': player_one_board,
                'player_two_board': player_two_board,
                'current_player': current_player,
                'winner': winner
            }
        )

    def chat_message(self, event):
        # Receive message from match group
        player_one_board = event['player_one_board']
        player_two_board = event['player_two_board']
        current_player = event['current_player']
        winner = event['winner']

        # get current count of connected users or default to 0 if it doesn't exist
        count_of_connected_users = cache.get(self.match_id, 0)
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'player_one_board': player_one_board,
            'player_two_board': player_two_board,
            'current_player': current_player,
            'winner': winner,
            'count_of_connected_users': count_of_connected_users
        }))