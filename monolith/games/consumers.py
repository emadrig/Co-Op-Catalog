import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.cache import cache
from .models import TicTacToeMatch


class TTTMatchConsumer(WebsocketConsumer):

    def check_for_winner(self, state):
        # horizontal check
        if state[0] == state[1] == state[2] != "n": return True
        elif state[6] == state[7] == state[8] != "n": return True
        elif state[3] == state[4] == state[5] != "n": return True

        # diagonal check
        elif state[0] == state[4] == state[8] != "n": return True
        elif state[2] == state[4] == state[6] != "n": return True

        # column check
        elif state[0] == state[3] == state[6] != "n": return True
        elif state[1] == state[4] == state[7] != "n": return True
        elif state[2] == state[5] == state[8] != "n": return True
        else: return False


    def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match']
        self.match_group_id = 'match_%s' % self.match_id
        # Join match group
        async_to_sync(self.channel_layer.group_add)(
            self.match_group_id,
            self.channel_name
        )

        # get current count of connected users or default to 0 if it doesn't exist
        count_of_connected_users = cache.get(self.match_id, 0)
        # increment the count of connected users
        cache.set(self.match_id, count_of_connected_users + 1)
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'state': 'nnnnnnnnn0'
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
                'state': TicTacToeMatch.objects.get(id=self.match_id).state,
                'count_of_connected_users': count_of_connected_users
            }
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        count_of_connected_users = cache.get(self.match_id, 0)
        text_data_json = json.loads(text_data)
        self.match = TicTacToeMatch.objects.get(id=self.match_id)
        state = list(self.match.state)
        player = state[9]
        letter = "X" if player == "0" else "O"
        if text_data_json['index'] != None:
            idx = text_data_json['index']
            state[idx] = letter
            winner = self.check_for_winner(state)
            print(winner)
            if winner:
                state.append("W")
                new_state = "".join(state)
                TicTacToeMatch.objects.filter(id=self.match_id).update(state=new_state)
                new_match = TicTacToeMatch.objects.get(id=self.match_id)
            else:
                player = "1" if player == "0" else "0"
                state[9] = player
                new_state = "".join(state)
                TicTacToeMatch.objects.filter(id=self.match_id).update(state=new_state)
                new_match = TicTacToeMatch.objects.get(id=self.match_id)
        else:
            new_match = TicTacToeMatch.objects.get(id=self.match_id)

        # Send message to match group
        async_to_sync(self.channel_layer.group_send)(
            self.match_group_id,
            {
                'type': 'chat_message',
                'state': new_match.state
            }
        )

    def chat_message(self, event):
        # Receive message from match group
        state = event['state']

        # get current count of connected users or default to 0 if it doesn't exist
        count_of_connected_users = cache.get(self.match_id, 0)
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'state': state,
            'count_of_connected_users': count_of_connected_users
        }))
