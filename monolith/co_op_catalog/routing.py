from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.consumers import TextRoomConsumer
from django.urls import re_path


django_asgi_app = get_asgi_application()
websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_name>[^/]+)/$', TextRoomConsumer.as_asgi()),
]


# the websocket will open at 127.0.0.1:8000/ws/<room_name>
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket':
        URLRouter(
            websocket_urlpatterns
        )
    ,
})