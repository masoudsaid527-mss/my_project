from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .models import UserProfile
import json
import re


def about_page(request):
    return render(request, "django_hostel_pages/about.html")


def rooms_page(request):
    return render(request, "django_hostel_pages/rooms.html")


def booking_page(request):
    return render(request, "django_hostel_pages/booking.html")


def contact_page(request):
    return render(request, "django_hostel_pages/contact.html")


def services_page(request):
    return render(request, "django_hostel_pages/services.html")


@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    """
    Handle user registration
    Expected POST data:
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "role": "student" or "hostel_owner",
        "password": "SecurePass123!",
        "confirm_password": "SecurePass123!"
    }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({
            "message": "Invalid JSON format"
        }, status=400)

    errors = {}

    # Validate input fields
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').strip()
    username = data.get('username', '').strip()
    role = data.get('role', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    # First name validation
    if not first_name:
        errors['firstName'] = 'First name is required'
    elif len(first_name) < 2:
        errors['firstName'] = 'First name must be at least 2 characters'

    # Last name validation
    if not last_name:
        errors['lastName'] = 'Last name is required'
    elif len(last_name) < 2:
        errors['lastName'] = 'Last name must be at least 2 characters'

    # Email validation
    if not email:
        errors['email'] = 'Email is required'
    else:
        try:
            validate_email(email)
            if User.objects.filter(email=email).exists():
                errors['email'] = 'Email already registered'
        except ValidationError:
            errors['email'] = 'Invalid email format'

    # Username validation
    if not username:
        errors['username'] = 'Username is required'
    elif len(username) < 3:
        errors['username'] = 'Username must be at least 3 characters'
    elif User.objects.filter(username=username).exists():
        errors['username'] = 'Username already exists'
    elif not re.match(r'^[a-zA-Z0-9_]+$', username):
        errors['username'] = 'Username can only contain letters, numbers, and underscores'

    # Role validation
    if not role:
        errors['role'] = 'Please select a role'
    elif role not in ['student', 'hostel_owner']:
        errors['role'] = 'Invalid role selected'

    # Password validation
    if not password:
        errors['password'] = 'Password is required'
    elif len(password) < 8:
        errors['password'] = 'Password must be at least 8 characters'
    elif not re.search(r'[A-Z]', password):
        errors['password'] = 'Password must contain at least one uppercase letter'
    elif not re.search(r'[a-z]', password):
        errors['password'] = 'Password must contain at least one lowercase letter'
    elif not re.search(r'[0-9]', password):
        errors['password'] = 'Password must contain at least one number'

    # Confirm password validation
    if password != confirm_password:
        errors['confirmPassword'] = 'Passwords do not match'

    # If there are errors, return them
    if errors:
        return JsonResponse({
            "message": "Validation failed",
            "errors": errors
        }, status=400)

    # Create the user
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create user profile with role
        UserProfile.objects.create(user=user, role=role)

        return JsonResponse({
            "message": "Registration successful",
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        }, status=201)

    except Exception as e:
        return JsonResponse({
            "message": f"Registration failed: {str(e)}"
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """
    Handle user login
    Expected POST data:
    {
        "username": "johndoe",
        "password": "SecurePass123!"
    }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({
            "message": "Invalid JSON format"
        }, status=400)

    username = data.get('username', '').strip()
    password = data.get('password', '')

    errors = {}

    if not username:
        errors['username'] = 'Username is required'
    if not password:
        errors['password'] = 'Password is required'

    if errors:
        return JsonResponse({
            "message": "Validation failed",
            "errors": errors
        }, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }, status=200)
    else:
        return JsonResponse({
            "message": "Invalid username or password"
        }, status=401)
