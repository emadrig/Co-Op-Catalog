from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.consumers import TextRoomConsumer
from games.consumers.ttt_consumer import TTTMatchConsumer
from django.urls import re_path


django_asgi_app = get_asgi_application()
websocket_urlpatterns = [
    re_path(r'^ws/(?P<room>[^/]+)/$', TextRoomConsumer.as_asgi()),
    re_path(r'^ws/tic_tac_toe/(?P<match>[^/]+)/$', TTTMatchConsumer.as_asgi()),
]


# the websocket will open at 127.0.0.1:8000/ws/<room>
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket':
        URLRouter(
            websocket_urlpatterns
        )
    ,
})