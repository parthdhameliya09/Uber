# POST /users/register

## Description

Creates a new user account and returns an authentication token and the created user object.

- URL: `/users/register`
- Method: `POST`
- Content-Type: `application/json`

## Request body

Send a JSON body with the following fields:

- `fullName` (object, required)
  - `firstname` (string, required) — minimum 3 characters
  - `lastname` (string, optional) — minimum 2 characters if provided
- `email` (string, required) — must be a valid email address
- `password` (string, required) — minimum 6 characters

Example request:

```json
{
  "fullName": {
    "firstname": "Alice",
    "lastname": "Johnson"
  },
  "email": "alice@example.com",
  "password": "secret123"
}
```

Notes:

- The server validates `fullName.firstname`, `email`, and `password` and will respond with `400 Bad Request` if validation fails.
- The `lastname` field is optional, but if supplied it must meet the minimum length constraint.

## Responses / Status codes

- `201 Created` — User successfully created.
  - Response body: `{ "token": "<jwt>", "user": { ... } }`
- `400 Bad Request` — Validation errors. Response body contains an `errors` array describing failures.
- `409 Conflict` — (Possible) Email already in use (depends on DB error handling).
- `500 Internal Server Error` — Unexpected server/database error.

Example successful response (201):

```json
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "60f6c0e7a2d4b5f1a1234567",
    "fullName": {
      "firstname": "Alice",
      "lastname": "Johnson"
    },
    "email": "alice@example.com",
    "socketId": null
  }
}
```

Example validation error (400):

```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Headers

- `Content-Type: application/json`

---

# POST /users/login

## Description

Authenticates an existing user and returns an authentication token and the user object.

- URL: `/users/login`
- Method: `POST`
- Content-Type: `application/json`

## Request body

Send a JSON body with the following fields:

- `email` (string, required) — must be a valid email address
- `password` (string, required) — minimum 6 characters

Example request:

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Notes:

- The server validates `email` and `password` and will respond with `400 Bad Request` if validation fails.
- If credentials are invalid (user not found or password mismatch), the endpoint returns `401 Unauthorized`.

## Responses / Status codes

- `200 OK` — User successfully authenticated.
  - Response body: `{ "token": "<jwt>", "user": { ... } }`
- `400 Bad Request` — Validation errors. Response body contains an `errors` array describing failures.
- `401 Unauthorized` — Invalid email or password.
  - Response body: `{ "message": "Invalid email or password" }`
- `500 Internal Server Error` — Unexpected server/database error.

Example successful response (200):

```json
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "60f6c0e7a2d4b5f1a1234567",
    "fullName": {
      "firstname": "Alice",
      "lastname": "Johnson"
    },
    "email": "alice@example.com",
    "socketId": null
  }
}
```

Example authentication error (401):

```json
{
  "message": "Invalid email or password"
}
```

## Headers

- `Content-Type: application/json`

---

# GET /users/profile

## Description

Retrieves the authenticated user's profile information. Requires a valid authentication token.

- URL: `/users/profile`
- Method: `GET`
- Authentication: Required (Bearer token or cookie)

## Request headers

- `Authorization: Bearer <token>` (or token in cookie)

Example request:

```
GET /users/profile
Authorization: Bearer eyJhbGci...
```

## Responses / Status codes

- `200 OK` — Profile retrieved successfully.
  - Response body: `{ "user": { ... } }`
- `401 Unauthorized` — Missing or invalid authentication token.
- `500 Internal Server Error` — Unexpected server/database error.

Example successful response (200):

```json
{
  "user": {
    "_id": "60f6c0e7a2d4b5f1a1234567",
    "fullName": {
      "firstname": "Alice",
      "lastname": "Johnson"
    },
    "email": "alice@example.com",
    "socketId": null
  }
}
```

---

# GET /users/logout

## Description

Logs out the authenticated user by invalidating the token and clearing the session.

- URL: `/users/logout`
- Method: `GET`
- Authentication: Required (Bearer token or cookie)

## Request headers

- `Authorization: Bearer <token>` (or token in cookie)

Example request:

```
GET /users/logout
Authorization: Bearer eyJhbGci...
```

## Responses / Status codes

- `200 OK` — User logged out successfully.
  - Response body: `{ "message": "Logout successful" }`
- `401 Unauthorized` — Missing or invalid authentication token.
- `500 Internal Server Error` — Unexpected server/database error.

Example successful response (200):

```json
{
  "message": "Logout successful"
}
```

Notes:

- The token is cleared from cookies and added to the blacklist to prevent reuse.
- After logout, any requests using the invalidated token will receive a `401 Unauthorized` response.

---

# POST /captains/register

## Description

Creates a new captain account with vehicle information and returns an authentication token and the created captain object.

- URL: `/captains/register`
- Method: `POST`
- Content-Type: `application/json`

## Request body

Send a JSON body with the following fields:

- `fullName` (object, required)
  - `firstname` (string, required) — minimum 3 characters
  - `lastname` (string, optional) — minimum 2 characters if provided
- `email` (string, required) — must be a valid email address
- `password` (string, required) — minimum 6 characters
- `vehicle` (object, required)
  - `color` (string, required) — minimum 3 characters
  - `plate` (string, required) — minimum 3 characters
  - `capacity` (integer, required) — minimum 1
  - `vehicleType` (string, required) — must be one of: `"car"`, `"motorcycle"`, `"auto"`

Example request:

```json
{
  "fullName": {
    "firstname": "Bob",
    "lastname": "Driver"
  },
  "email": "bob@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "black",
    "plate": "ABC1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

Notes:

- All vehicle fields are required.
- Vehicle type must be exactly one of: `"car"`, `"motorcycle"`, or `"auto"`.
- The server validates all fields and will respond with `400 Bad Request` if validation fails.

## Responses / Status codes

- `201 Created` — Captain successfully registered.
  - Response body: `{ "token": "<jwt>", "captain": { ... } }`
- `400 Bad Request` — Validation errors. Response body contains an `errors` array describing failures.
- `409 Conflict` — Email already in use.
- `500 Internal Server Error` — Unexpected server/database error.

Example successful response (201):

```json
{
  "token": "eyJhbGci...",
  "captain": {
    "_id": "60f6c0e7a2d4b5f1a7654321",
    "fullName": {
      "firstname": "Bob",
      "lastname": "Driver"
    },
    "email": "bob@example.com",
    "vehicle": {
      "color": "black",
      "plate": "ABC1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

Example validation error (400):

```json
{
  "errors": [
    {
      "msg": "Invalid vehicle type",
      "param": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

## Headers

- `Content-Type: application/json`

---

File: Backend/README.md
