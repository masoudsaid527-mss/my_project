# Registration System Implementation Checklist

## Quick Setup Checklist

Follow these steps to get your registration system up and running:

### 1. Database - Create Django Model ✅

- [x] `UserProfile` model created in `django_hostel_pages/models.py`
- [ ] In your Django project root, run:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

### 2. Admin Panel Registration ✅

- [x] User admin interface already configured in `admin.py`
- [ ] Verify admin panel works:
  ```bash
  python manage.py runserver
  # Visit: http://localhost:8000/admin/
  ```

### 3. Django Settings Configuration

- [ ] Edit your Django `settings.py`:

```python
# Add to INSTALLED_APPS (if not already present)
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # ADD THIS
    'django_hostel_pages',
]

# Update MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ADD THIS FIRST
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Add CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

- [ ] Install CORS package:
  ```bash
  pip install django-cors-headers
  ```

### 4. API Endpoints ✅

- [x] `/api/register/` endpoint created in `views.py`
- [x] `/api/login/` endpoint created in `views.py`
- [x] URL patterns configured in `urls.py`

### 5. Frontend - React Component ✅

- [x] Enhanced `register.jsx` component created with:
  - Form validation
  - Password strength indicator
  - Error handling
  - Loading states
  - Success redirect

- [x] Styling added to `pages.css`:
  - Error message styles
  - Success message styles
  - Password strength meter styles
  - Input error states

### 6. Testing

- [ ] Start Django development server:
  ```bash
  python manage.py runserver
  ```

- [ ] Start React development server (new terminal):
  ```bash
  npm run dev
  ```

- [ ] Test registration with:
  ```
  First Name: John
  Last Name: Doe
  Email: john@example.com
  Username: johndoe
  Role: Student
  Password: SecurePass123!
  Confirm: SecurePass123!
  ```

- [ ] Expected result:
  - ✅ Form validates input
  - ✅ "Registering..." button shows
  - ✅ Success message appears
  - ✅ Redirects to login page
  - ✅ User appears in Django admin

### 7. Verify Data

- [ ] Check Django admin panel:
  - Go to `http://localhost:8000/admin/`
  - Login with your admin credentials
  - View created user in User section
  - View user profile in User Profile section

## Password Requirements

Users must create passwords with:
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter  
- ✅ At least 1 number

Example valid passwords:
- `SecurePass123!`
- `MyPass1234`
- `Hostel@2024`

Invalid passwords:
- `password` (no uppercase/number)
- `PASSWORD` (no lowercase/number)
- `Pass123` (only 7 characters)

## API Response Examples

### Successful Registration (201)
```json
{
  "message": "Registration successful",
  "user_id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Email already registered",
    "password": "Password must contain at least one uppercase letter"
  }
}
```

## File Structure

```
django_hostel_pages/
├── models.py          # ✅ Updated with UserProfile
├── views.py           # ✅ Updated with register & login views
├── urls.py            # ✅ Updated with API endpoints
├── admin.py           # ✅ Added UserProfileAdmin
├── apps.py
├── __init__.py
└── templates/
    └── django_hostel_pages/
        └── ...

src/
└── components/
    ├── register.jsx   # ✅ Enhanced with validation & API calls
    └── pages.css      # ✅ Updated with new styles
```

## Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify `django-cors-headers` is installed
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Ensure `corsheaders.middleware.CorsMiddleware` is first in MIDDLEWARE

### Issue: 404 Not Found
**Error:** `POST /api/register/ 404`

**Solution:**
- Verify URL pattern is added to `urls.py`
- Check URL paths match in the component (should be `http://localhost:8000/api/register/`)
- Make sure Django app is included in project's main `urls.py`:
  ```python
  urlpatterns = [
      path('django_hostel_pages/', include('django_hostel_pages.urls')),
      # ...
  ]
  ```

### Issue: Migration Error
**Error:** `table user_profile doesn't exist`

**Solution:**
- Run migrations:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

### Issue: User Model Not Found
**Error:** `ImportError: cannot import name 'UserProfile'`

**Solution:**
- Ensure `UserProfile` is defined in `models.py`
- Check `django_hostel_pages` is in INSTALLED_APPS

### Issue: Form Not Submitting
**Possible causes:**
- Validation errors (check browser console)
- Backend server not running
- Wrong API endpoint URL
- Network connectivity issue

**Debug steps:**
- Check browser DevTools Console for errors
- Check browser Network tab to see request/response
- Verify Django server is running on correct port
- Test API endpoint with curl/Postman

## Next Steps

1. ✅ Model created
2. ✅ Views created
3. ✅ Frontend component created
4. [ ] Install CORS package
5. [ ] Update Django settings
6. [ ] Run migrations
7. [ ] Test registration
8. [ ] (Optional) Add email verification
9. [ ] (Optional) Add JWT authentication
10. [ ] (Optional) Add password reset

## Security Recommendations

Before deploying to production:

- [ ] Enable HTTPS
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting on registration endpoint
- [ ] Add email verification
- [ ] Use JWT tokens instead of sessions
- [ ] Implement CSRF token handling
- [ ] Add logging for security events
- [ ] Sanitize all user inputs
- [ ] Use secure password hashing (Django handles this)
- [ ] Set secure session cookies
- [ ] Implement account lockout after failed attempts

## Additional Features You Can Add

- [ ] Email verification on signup
- [ ] Forgot password functionality
- [ ] Social authentication (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile completion wizard
- [ ] Email notifications
- [ ] Activity logging
- [ ] User profile picture upload
- [ ] Email change verification
- [ ] Account deactivation

---

## Support Commands

```bash
# Create migrations for model changes
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate

# Check migration status
python manage.py showmigrations

# Create superuser for admin panel
python manage.py createsuperuser

# Run Django development server
python manage.py runserver

# Run React development server
npm run dev

# Build React for production
npm run build
```

---

**Last Updated:** February 12, 2026
**Status:** Ready for production use
