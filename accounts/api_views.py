from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, authenticate, logout
from django.utils import timezone
import json
from common.json import ModelEncoder
from .models import User
from .guest_generator import make_guest


class AccountModelEncoder(ModelEncoder):
    model = User
    properties = ["email", "first_name", "last_name", "username", "is_guest"]


class AccountInfoModelEncoder(ModelEncoder):
    model = User
    properties = ["email", "first_name", "last_name", "is_active"]

    def get_extra_data(self, o):
        return {"updated": timezone.now()}


def create_user(json_content):
    try:
        content = json.loads(json_content)
    except json.JSONDecodeError:
        return 400, {"message": "Bad JSON"}, None

    required_properties = [
        "username",
        "email",
        "password",
        "first_name",
        "last_name",
    ]
    missing_properties = []
    for required_property in required_properties:
        if (required_property not in content or len(content[required_property]) == 0):
            missing_properties.append(required_property)
    if missing_properties:
        response_content = {
            "message": "missing properties",
            "properties": missing_properties,
        }
        return 400, response_content, None

    try:
        account = User.objects.create_user(
            username=content["username"],
            email=content["email"],
            password=content["password"],
            first_name=content["first_name"],
            last_name=content["last_name"],
        )
        return 200, account, account
    except IntegrityError as e:
        return 409, {"message": str(e)}, None
    except ValueError as e:
        return 400, {"message": str(e)}, None


@require_http_methods(["GET", "POST"])
def api_list_accounts(request):
    if request.method == "GET":
        users = User.objects.exclude(email="").filter(is_active=True)
        return JsonResponse(
            {"accounts": users},
            encoder=AccountModelEncoder,
        )
    else:
        status_code, response_content, _ = create_user(request.body)
        response = JsonResponse(
            response_content,
            encoder=AccountModelEncoder,
            safe=False,
        )
        response.status_code = status_code
        return response


@require_http_methods(["GET", "PUT", "DELETE"])
def api_account_detail(request, username):
    try:
        account = User.objects.filter(is_active=True).get(username=username)
    except User.DoesNotExist:
        print("User.DoesNotExist", username)
        if request.method == "GET":
            response = JsonResponse({"message": username})
            response.status_code = 404
            return response
        else:
            account = None

    if request.method == "GET":
        return JsonResponse(
            account,
            encoder=AccountModelEncoder,
            safe=False,
        )
    elif request.method == "PUT":
        try:
            content = json.loads(request.body)
        except json.JSONDecodeError:
            response = JsonResponse({"message": "Bad JSON"})
            response.status_code = 400
            return response
        if account.is_guest:
            content['is_guest'] = False
        if account is not None:
            for property in content:
                if property != "password" and hasattr(account, property):
                    setattr(account, property, content[property])
                elif property == "password":
                    account.set_password(content["password"])
            status = 200
            response_content = account
        else:
            status, response_content, account = create_user(request.body)
        if account:
            print(account.email)
            account.save()
        response = JsonResponse(
            response_content,
            encoder=AccountModelEncoder,
            safe=False,
        )
        response.status_code = status
        return response
    else:
        account.is_active = False
        account.save()
        response = HttpResponse()
        response.status_code = 204
        return response

# @csrf_exempt
@require_http_methods(["POST"])
def user_login(request):
    content = json.loads(request.body)
    username = content["username"]
    password = content["password"]
    user = authenticate(
        request,
        username=username,
        password=password,
    )
    if user is not None:
        login(request, user)
        return JsonResponse({
            "message": "You're logged in!"
        })
    else:
        return JsonResponse({
            "message": "Can't login"
        })

@require_http_methods(["POST"])
def api_create_guest(request):
    user_info = make_guest()
    status_code, response_content, new_user = create_user(json.dumps(user_info))
    new_user.is_guest = True
    new_user.save()
    user = authenticate(
        request,
        username=user_info['username'],
        password=user_info['password'],
    )
    if user is not None:
        login(request, user)
        return JsonResponse(
            {"Guest": user},
            encoder=AccountModelEncoder,
            safe=False
            )
    else:
        api_create_guest(request)


def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({
            "message": "You are logged out!"
        })
    else:
        return JsonResponse({
            "message": "You weren't logged in"
        })