from django.urls import path

from .api_views import api_list_accounts, api_account_detail, user_login

urlpatterns = [
    path("accounts/", api_list_accounts, name="api_list_accounts"),
    path("accounts/<str:username>/", api_account_detail,name="api_account_detail"),
    path("accounts/login/", user_login, name="user_login" )
]
