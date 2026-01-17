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

File: Backend/users_register.md
