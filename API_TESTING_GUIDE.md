# API Testing Guide

## Overview
This guide helps you test the registration and login API endpoints using various tools.

## Test Cases

### Test Case 1: Valid Registration
**Objective:** Register a new user successfully

**Steps:**
1. Ensure Django server is running on `http://localhost:8000`
2. Use the register form with valid data
3. Verify success response and user creation

**Expected Result:** 
- Status: 201 Created
- User created in database
- Redirect to login page

---

### Test Case 2: Email Already Exists
**Objective:** Prevent duplicate email registration

**Data:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "username": "johndoe2",
  "role": "student",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
```

**Expected Result:**
- Status: 400 Bad Request
- Error: "Email already registered"

---

### Test Case 3: Username Already Exists
**Objective:** Prevent duplicate username registration

**Data:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "username": "johndoe",
  "role": "student",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
```

**Expected Result:**
- Status: 400 Bad Request
- Error: "Username already exists"

---

### Test Case 4: Weak Password
**Objective:** Enforce password strength requirements

**Data:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john3@example.com",
  "username": "johndoe3",
  "role": "student",
  "password": "weak",
  "confirm_password": "weak"
}
```

**Expected Result:**
- Status: 400 Bad Request
- Error: "Password must be at least 8 characters"

---

### Test Case 5: Passwords Don't Match
**Objective:** Ensure password confirmation matches password

**Data:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john4@example.com",
  "username": "johndoe4",
  "role": "student",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass456!"
}
```

**Expected Result:**
- Status: 400 Bad Request
- Error: "Passwords do not match"

---

### Test Case 6: Invalid Email Format
**Objective:** Validate email format

**Data:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "notanemail",
  "username": "johndoe5",
  "role": "student",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
```

**Expected Result:**
- Status: 400 Bad Request
- Error: "Invalid email format"

---

### Test Case 7: Valid Login
**Objective:** Login with correct credentials

**Data:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: 200 OK
- Response includes user details
- Redirect to dashboard

---

### Test Case 8: Invalid Credentials
**Objective:** Reject login with wrong password

**Data:**
```json
{
  "username": "johndoe",
  "password": "WrongPassword123!"
}
```

**Expected Result:**
- Status: 401 Unauthorized
- Error: "Invalid username or password"

---

## Using cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "student",
    "password": "SecurePass123!",
    "confirm_password": "SecurePass123!"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }'
```

---

## Using Postman

### Setup

1. **Create a new Request**
   - Method: POST
   - URL: `http://localhost:8000/api/register/`

2. **Configure Headers**
   - Click "Headers" tab
   - Add: `Content-Type: application/json`

3. **Add Request Body**
   - Click "Body" tab
   - Select "raw"
   - Select "JSON" from dropdown
   - Paste test data

4. **Send Request**
   - Click "Send"
   - View response

### Import Postman Collection

Create a file `registration-api.postman_collection.json`:

```json
{
  "info": {
    "name": "Hostel Registration API",
    "description": "Collection for testing registration endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"username\": \"johndoe\",\n  \"role\": \"student\",\n  \"password\": \"SecurePass123!\",\n  \"confirm_password\": \"SecurePass123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8000/api/register/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "register", ""]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"johndoe\",\n  \"password\": \"SecurePass123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8000/api/login/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "login", ""]
        }
      }
    }
  ]
}
```

---

## Using JavaScript/Fetch

### Test in Browser Console

```javascript
// Register User
fetch('http://localhost:8000/api/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    username: 'johndoe',
    role: 'student',
    password: 'SecurePass123!',
    confirm_password: 'SecurePass123!'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Login User
fetch('http://localhost:8000/api/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'SecurePass123!'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Response Reference

### Successful Registration (201)
```json
{
  "message": "Registration successful",
  "user_id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### Successful Login (200)
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

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "errors": {
    "password": "Password must be at least 8 characters",
    "email": "Email already registered"
  }
}
```

### Invalid Credentials (401)
```json
{
  "message": "Invalid username or password"
}
```

### Server Error (500)
```json
{
  "message": "Registration failed: [error details]"
}
```

---

## HTTP Status Codes Reference

| Code | Meaning | Typical Use |
|------|---------|------------|
| 200 | OK | Successful login |
| 201 | Created | Successful registration |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Invalid credentials |
| 405 | Method Not Allowed | Wrong HTTP method |
| 500 | Server Error | Backend error |

---

## Debugging Tips

### Check Network in Browser DevTools

1. Open Developer Tools (F12)
2. Go to Network tab
3. Fill form and submit
4. Click on the request
5. Check:
   - Request body (correct data?)
   - Response status code
   - Response body (error message?)

### Common Debug Checklist

- [ ] Is Django server running?
  ```bash
  python manage.py runserver
  ```

- [ ] Is the URL correct?
  ```
  http://localhost:8000/api/register/
  ```

- [ ] Is CORS configured?
  - Check settings.py for CORS_ALLOWED_ORIGINS
  - Verify corsheaders is installed

- [ ] Is the request method correct?
  - Should be POST, not GET

- [ ] Is the Content-Type header correct?
  -Should be `application/json`

- [ ] Are all required fields present?
  - Check request body in DevTools

- [ ] Is the data format correct?
  - Use JSON.stringify() not form data

### View Request/Response in Browser Console

```javascript
// In browser console, after failed request
fetch('http://localhost:8000/api/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...})
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Response:', data);
})
.catch(err => {
  console.error('Error:', err);
});
```

---

## Automated Testing

### Python Test Script

```python
import requests
import json

BASE_URL = 'http://localhost:8000'

def test_registration():
    """Test user registration"""
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": f"john{int(time.time())}@example.com",
        "username": f"johndoe{int(time.time())}",
        "role": "student",
        "password": "SecurePass123!",
        "confirm_password": "SecurePass123!"
    }
    
    response = requests.post(
        f'{BASE_URL}/api/register/',
        json=data,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 201
    print("✓ Registration test passed")

def test_login():
    """Test user login"""
    data = {
        "username": "johndoe",
        "password": "SecurePass123!"
    }
    
    response = requests.post(
        f'{BASE_URL}/api/login/',
        json=data,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    print("✓ Login test passed")

if __name__ == '__main__':
    test_registration()
    test_login()
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test registration endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -p data.json -T application/json http://localhost:8000/api/register/
```

Where `data.json` contains:
```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "username": "testuser",
  "role": "student",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
```

---

## Troubeshooting Common Issues

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check CORS settings in Django `settings.py`

### Issue: Connection Refused
```
Failed to fetch
```
**Solution:** Make sure Django is running: `python manage.py runserver`

### Issue: 405 Method Not Allowed
```
HTTP 405
```
**Solution:** Ensure URL endpoint exists in `urls.py`

### Issue: Invalid JSON
```
JSONDecodeError
```
**Solution:** Verify request body is valid JSON in the network console

---

**Last Updated:** February 12, 2026
