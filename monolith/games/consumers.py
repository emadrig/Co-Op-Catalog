import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import TicTacToeMatch

class TTTMatchConsumer(WebsocketConsumer):
    count_of_connected_users = 0

    def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match']
        self.match_group_id = 'match_%s' % self.match_id
        # Join match group
        async_to_sync(self.channel_layer.group_add)(
            self.match_group_id,
            self.channel_name
        )
        TTTMatchConsumer.count_of_connected_users += 1
        self.accept()

    def disconnect(self, close_code):
        # Leave match group
        async_to_sync(self.channel_layer.group_discard)(
            self.match_group_id,
            self.channel_name
        )
        TTTMatchConsumer.count_of_connected_users -= 1

    def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        self.match = TicTacToeMatch.objects.get(id=self.match_id)
        state = list(self.match.state)
        player = state[9]
        letter = "X" if player == "0" else "O"
        idx = text_data_json['index']
        state[idx] = letter
        player = "1" if player == "0" else "0"
        state[9] = player
        new_state = "".join(state)
        TicTacToeMatch.objects.filter(id=self.match_id).update(state=new_state)
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
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'state': state,
            'count_of_connected_users': TTTMatchConsumer.count_of_connected_users
        }))
