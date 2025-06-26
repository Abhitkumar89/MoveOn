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

# Captain API Documentation

## Register Captain Endpoint

### Endpoint

`POST /captains/register`

### Description

Registers a new captain (driver) in the system. This endpoint validates the input data including personal information and vehicle details.

### Request Body

The request body must be a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)",
  "vehicle": {
    "color": "string (min 3 chars, required)",
    "plate": "string (min 3 chars, required)",
    "capacity": "number (min 1, required)",
    "vehicleType": "string (enum, required)"
  }
}
```

### Vehicle Types

The following vehicle types are supported:

- `car`
- `bike`
- `auto-rickshaw`
- `truck`

### Example Request

```
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.driver@example.com",
  "password": "secure123",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

#### Success (201 Created)

```
{
  "captain": {
    "_id": "<captain_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.driver@example.com",
    "vehicle": {
      "color": "Blue",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Validation Error (400 Bad Request)

```
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be at least 3 characters",
      "param": "fullname.firstname",
      "location": "body"
    }
    // ... other validation errors
  ]
}
```

### Field Validations

- `email`: Must be a valid email address
- `fullname.firstname`: Minimum 3 characters
- `password`: Minimum 6 characters
- `vehicle.color`: Minimum 3 characters
- `vehicle.plate`: Minimum 3 characters
- `vehicle.capacity`: Must be an integer greater than or equal to 1
- `vehicle.vehicleType`: Must be one of: 'car', 'bike', 'auto-rickshaw', 'truck'

### Error Responses

- `400 Bad Request`: Validation errors or missing required fields
- `500 Internal Server Error`: For unexpected server errors

### Notes

- All fields marked as required must be provided
- Vehicle type must be one of the predefined types
- Email must be unique in the system
- Password will be securely hashed before storage

## Captain Login Endpoint

### Endpoint

`POST /captains/login`

### Description

Authenticates a captain with email and password. Returns a cookie with JWT token and captain data if credentials are valid.

### Request Body

```
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```
{
  "email": "john.driver@example.com",
  "password": "secure123"
}
```

### Responses

#### Success (200 OK)

```
Status: 200 OK
{
  "message": "Login successful",
  "captain": {
    "_id": "<captain_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.driver@example.com",
    "vehicle": {
      "color": "Blue",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Validation Error (400 Bad Request)

```
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Authentication Error (401 Unauthorized)

```
{
  "message": "Invalid email or password"
}
```

### Notes

- Authentication token is set as an HTTP-only cookie
- Cookie expiration is set to 24 hours

## Captain Profile Endpoint

### Endpoint

`GET /captains/profile`

### Description

Retrieves the profile information of the currently authenticated captain.

### Authentication

Requires a valid JWT token in one of the following:

- Authorization header: `Bearer <token>`
- Cookie: `token=<token>`

### Responses

#### Success (200 OK)

```
{
  "_id": "<captain_id>",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.driver@example.com",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Authentication Error (401 Unauthorized)

```
{
  "message": "Authentication required"
}
```

#### Not Found Error (404 Not Found)

```
{
  "message": "Captain not found"
}
```

## Captain Logout Endpoint

### Endpoint

`GET /captains/logout`

### Description

Logs out the currently authenticated captain by clearing their authentication token cookie and blacklisting the current token.

### Authentication

Requires a valid JWT token in one of the following:

- Authorization header: `Bearer <token>`
- Cookie: `token=<token>`

### Responses

#### Success (200 OK)

```
{
  "message": "Logged out successfully"
}
```

#### Authentication Error (401 Unauthorized)

```
{
  "message": "Authentication required"
}
```

### Notes

- The token will be blacklisted to prevent reuse
- The authentication cookie will be cleared from the client


# 🚕 GET /rides/get-fare

This endpoint calculates and returns the estimated fare for a ride between the provided pickup and destination locations.

---

## 🔐 Authentication

- Required: ✅ Yes (JWT)
- Pass the token in the `Authorization` header as:  
  `Authorization: Bearer <your_token>`

---

## 📥 Query Parameters

| Name         | Type   | Required | Description                               |
|--------------|--------|----------|-------------------------------------------|
| `pickup`     | string | ✅ Yes    | Pickup location address (min 1 character) |
| `destination`| string | ✅ Yes    | Destination location address (min 1 character) |

📌 Example:
GET /rides/get-fare?pickup=Connaught%20Place&destination=India%20Gate

yaml
Copy
Edit

---

## ✅ Success Response

**Status:** `200 OK`

```json
{
  "fare": 120,
  "distance": 5.2,
  "currency": "INR"
}
fare: Total estimated fare in INR.

distance: Estimated distance in kilometers.

currency: Always "INR" for now.

⚠️ Validation Error
Status: 400 Bad Request

json
Copy
Edit
{
  "errors": [
    {
      "msg": "invalid Pickup location",
      "param": "pickup",
      "location": "query"
    },
    {
      "msg": "invalid Destination location",
      "param": "destination",
      "location": "query"
    }
  ]
}
🛠️ Server Error
Status: 500 Internal Server Error

json
Copy
Edit
{
  "message": "Error message details"
}