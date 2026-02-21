# Registration System Setup Guide

This guide explains how to properly set up and use the new registration system for the Hostel management application.

## Frontend Setup (React)

### Updated Register Component
The `register.jsx` component now includes:

✅ **Real-time validation**
- Email format validation
- Password strength checking (5-level indicator)
- Password confirmation matching
- Username length and format validation
- Field-specific error messages

✅ **User-friendly features**
- Visual password strength meter
- Real-time error feedback
- Success message with redirect
- Loading state during registration
- Responsive form styling

✅ **State management**
- Proper form state handling with React hooks
- Individual field validation
- Error tracking per field

## Backend Setup (Django)

### 1. Update Django Settings (settings.py)

Add CORS support to your Django settings:

```python
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    # ... other apps
    'corsheaders',  # Add this
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",  # Alternative port
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

Install CORS middleware:
```bash
pip install django-cors-headers
```

### 2. API Endpoints

The registration system provides two main endpoints:

#### **POST /api/register/**
Register a new user

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "role": "student",  // or "hostel_owner"
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful",
  "user_id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Error Response (400):**
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Email already registered",
    "password": "Password must meet requirements"
  }
}
```

#### **POST /api/login/**
Login a user

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user_id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid username or password"
}
```

## Password Requirements

Passwords must meet these criteria:
- ✅ At least 8 characters long
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ Matching confirmation password

## User Roles

The system supports two roles:
- **student**: Regular user looking for hostel accommodation
- **hostel_owner**: Owner of hostel facilities

## Validation Rules

### Username
- Required field
- Minimum 3 characters
- Can contain letters, numbers, and underscores only
- Must be unique in the system

### Email
- Required field
- Must be a valid email format
- Must be unique in the system

### Names
- First and last names required
- Minimum 2 characters each

## Frontend Configuration

The register component is configured to send requests to:
```
http://localhost:8000/api/register/
```

If your Django server runs on a different port, update the URL in `register.jsx`:

```javascript
const response = await fetch('http://your-domain:port/api/register/', {
  // ...
})
```

## Testing the Registration

1. Start your Django development server:
```bash
python manage.py runserver
```

2. Start your React development server:
```bash
npm run dev
```

3. Navigate to the registration page and test with:
```
First Name: John
Last Name: Doe
Email: john@example.com
Username: johndoe
Role: Student
Password: SecurePass123!
Confirm Password: SecurePass123!
```

## Enhanced Features

### Password Strength Indicator
The form displays a 5-level password strength meter:
- 🔴 Level 1: Weak (8+ characters)
- 🟠 Level 2: Fair (+ uppercase)
- 🟡 Level 3: Good (+ lowercase)
- 🟢 Level 4: Strong (+ numbers)
- 🟢 Level 5: Very Strong (+ special characters)

### Error Handling
- Field-level error messages
- General error messages for server issues
- Specific validation error feedback
- Form prevents submission with invalid data

### Loading State
- Button shows "Registering..." during submission
- Button is disabled during processing
- Prevents double submissions

### Success Flow
- Success message displayed
- Form clears automatically
- Automatic redirect to login page after 2 seconds

## Database Considerations

Your User model needs to support:
- username (unique)
- email (unique)
- password (hashed)
- first_name
- last_name

If you need to store the "role" field, consider:

### Option 1: Create a UserProfile Model

```python
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('hostel_owner', 'Hostel Owner'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
```

Then modify the register view to create a UserProfile:

```python
user = User.objects.create_user(...)
UserProfile.objects.create(user=user, role=role)
```

### Option 2: Extend User Model with AbstractUser

Create a custom user model for more flexibility.

## Troubleshooting

### CORS Errors
Make sure `django-cors-headers` is installed and configured properly in settings.py.

### 405 Method Not Allowed
Ensure the view has `@require_http_methods(["POST"])` decorator.

### JSON Parse Errors
Check that the request body is valid JSON format.

### User Already Exists
The system prevents duplicate usernames and emails. Create error handling for this case.

## Security Notes

✅ **Current security features:**
- Password strength validation
- Input field validation
- CSRF protection (disabled for API - should use tokens in production)
- Email validation

⚠️ **For production, consider:**
- Implement JWT tokens for authentication
- Add rate limiting to prevent brute force attacks
- Use HTTPS for all requests
- Implement email verification
- Add user session management
- Use environment variables for Django configuration
- Implement proper CSRF token handling for API requests

## Next Steps

1. Configure Django CORS settings
2. Run Django migrations
3. Test registration with valid email format
4. Implement UserProfile model if needed for role storage
5. Setup email verification (optional)
6. Add JWT authentication for secure sessions
7. Implement forgot password functionality

---

For questions or issues, refer to the React Hook documentation and Django Rest Framework best practices.
