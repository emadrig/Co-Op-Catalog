from django.urls import path

from .api_views import api_list_accounts, api_account_detail, user_login, user_logout, api_create_guest

urlpatterns = [
    path("", api_list_accounts, name="api_list_accounts"),
    path("create-guest/", api_create_guest, name="api_create_guest"),
    path("login/", user_login, name="user_login" ),
    path("logout/", user_logout, name="logout"),
    path("<str:username>/", api_account_detail,name="api_account_detail"),
]
