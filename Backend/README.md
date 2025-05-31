# User Registration and Login Endpoint Documentation

## User Registration

### Endpoint

`POST /users/register`

### Description

Registers a new user in the system. This endpoint validates the input, hashes the password, creates a user, and returns an authentication token along with the user data.

### Request Body

The request body must be a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (min 3 chars, required)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Responses

#### Success (201 Created)

```
Status: 201 Created
{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // ...other user fields
  }
}
```

#### Validation Error (400 Bad Request)

```
Status: 400 Bad Request
{
  "errors": [
    {
      "msg": "Please enter a valid email address",
      "param": "email",
      "location": "body"
    },
    // ...other errors
  ]
}
```

#### Other Errors

- `500 Internal Server Error`: For unexpected server errors.

### Notes

- All fields are required.
- Passwords are securely hashed before storage.
- The returned token is a JWT for authentication in subsequent requests.

## User Login

### Endpoint

`POST /users/login`

### Description

Authenticates a user with email and password. Returns a JWT token and user data if credentials are valid.

### Request Body

The request body must be a JSON object with the following structure:

```
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Responses

#### Success (200 OK)

```
Status: 200 OK
{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // ...other user fields
  }
}
```

#### Validation Error (400 Bad Request)

```
Status: 400 Bad Request
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    // ...other errors
  ]
}
```

#### Authentication Error (401 Unauthorized)

```
Status: 401 Unauthorized
{
  "message": "Invalid email or password"
}
```

#### Other Errors

- `500 Internal Server Error`: For unexpected server errors.

### Notes

- Both fields are required.
- Passwords are compared securely.
- The returned token is a JWT for authentication in subsequent requests.

# User Profile Endpoint Documentation

## Endpoint

`GET /users/profile`

## Description
Retrieves the profile information of the currently authenticated user.

## Authentication
Requires a valid JWT token in one of the following:
- Authorization header: `Bearer <token>`
- Cookie: `token=<token>`

## Responses

### Success (200 OK)
```
Status: 200 OK
{
  "_id": "<user_id>",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
  // ...other user fields
}
```

### Authentication Error (401 Unauthorized)
```
Status: 401 Unauthorized
{
  "message": "Authentication required"
}
```

### Other Errors
- `500 Internal Server Error`: For unexpected server errors.

# User Logout Endpoint Documentation

## Endpoint

`GET /users/logout`

## Description
Logs out the currently authenticated user by clearing their authentication token cookie and blacklisting the current token.

## Authentication
Requires a valid JWT token in one of the following:
- Authorization header: `Bearer <token>`
- Cookie: `token=<token>`

## Responses

### Success (200 OK)
```
Status: 200 OK
{
  "message": "Logged out successfully"
}
```

### Authentication Error (401 Unauthorized)
```
Status: 401 Unauthorized
{
  "message": "Authentication required"
}
```

### Other Errors
- `500 Internal Server Error`: For unexpected server errors.

## Notes
- The token used for logout will be blacklisted to prevent reuse
- The authentication cookie will be cleared from the client
