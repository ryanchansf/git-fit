# API Specification

## X. Endpoint Name

### X.X. Function Name - `URL` (TYPE)

Description of function.

**Request:**

```json
{
  "json-request": "content type"
}
```

**Returns:**

```json
{
  "json-return": "content type"
}
```


## 1. Users

### 1.1. New User - `/users/` (POST)

Creates a new user. User inputs their desired username and their email, and receives their User ID in return. We should probably include passwords for verifcation purposes, but then we have to hash and secure it somehow. Can add later down the line if necessary. 

**Request:**

```json
{
  "username": "string",
  "email": "string"
}
```

**Returns:**

```json
{
  "userID": "int"
}
```

### 1.2. Update User - `/users/{userID}/` (POST)

Updates an existing user's information. Fields are optional-fill in one, none, or both to update. Should have to authenticate with password, if we end up doing that.

**Request:**

```json
{
  "username": "string",
  "email": "string"
}
```

**Returns:**

```json
{
  "success": "boolean"
}
```

### 1.3. Delete User - `/users/{userID}/delete` (DELETE)

Deletes a user and their account based on their ID. Should have to authenticate with password, if we end up doing that.

**Request:**

```json
{
  
}
```

**Returns:**

```json
{
  "success": "boolean"
}
```
