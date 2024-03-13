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

### 1.4. Create Workout - `/users/{userID}/` (POST)

Creates a blank workout with nothing in it. Returns the ID of the newly created blank workout. From here, the user will use the workout ID to add exercises to it.

**Request:**

```json
{
  "workoutName": "string"
}
```

**Returns:**

```json
{
  "workoutID": "string"
}
```

## 2. Follow

### 2.1. Follow User - `/follow/{userID}/` (POST)

Adds a user to the user's "following" list. The URL userID is the current user, and the JSON request userID is the desired user to follow.

**Request:**

```json
{
  "username": "string"
}
```

**Returns:**

```json
{
  "success": "boolean"
}
```

### 2.2. See Followers/Following - `/follow/{userID}/` (GET)

Shows a list of the people the user is following and people following the user. Both fields are optional-set one, none, or both to true. Will display as two separate lists if both are checked. May end up having to be two separate endpoints, depending on how the frontend is implemented.

**Request:**

```json
{
  "showFollowing": "boolean",
  "showFollowers": "boolean"
}
```

**Returns:**

```json
{
  "following": "array"
  {
    "username": "string"
  },
  "followers": "array"
  {
    "username": "string"
  }
}
```

### 2.3. Search Users - `/follow/` (GET)

Search existing users on Git Fit by whole or partial username. Returns a list of matching users-note that the complete username is necessary to follow someone.

**Request:**

```json
{
  "username": "string"
}
```

**Returns:**

```json
{
  "users": "array"
  {
    "username": "string"
  }
}
```

## 3. Workouts

### 3.1. Search Exercises - `/workouts/` (GET)

Searches for existing exercises. Can search by exercise name, muscle group, or equipment. Returns the full name of the exercise, including its ID, which the user needs to add it to their workout. Search fields are all optional.

**Request:**

```json
{
  "exerciseName": "string",
  "muscleGroup": "string",
  "equipment": "string"
}
```

**Returns:**

```json
{
  "exercises": "array"
  {
    "exerciseName": "string",
    "muscleGroup": "string",
    "equipment": "string",
    "exerciseID": "int"
  }
}
```

### 3.2. Create Exercise - `/workouts/` (POST)

Allows the user to create a new exercise. Created exercises are universal to Git Fit-User A can use an exercise created by User B. Returns an exercise ID, which the user uses to add the exercise to a workout.

**Request:**

```json
{
  "exerciseName": "string",
  "muscleGroup": "string",
  "equipment": "string"
}
```

**Returns:**

```json
{
  "exerciseID": "int"
}
```

### 3.3. Add Exercise to Workout - `/workouts/{workoutID}/` (POST)

Adds an exercise to a workout based on the exercise's ID.

**Request:**

```json
{
  "exerciseID": "int"
}
```

**Returns:**

```json
{
  "success": "boolean"
}
```

### 3.4. Delete Workout - `/workouts/{workoutID}/delete` (DELETE)

Deletes the desired workout. Should have to authenticate with password, if we end up doing that.

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

### Workouts Example Flow

Caroline wants to build her small calves so she calls create workout and passes in "Kalf Killer" and gets back a workout id of 1. She is overwhelmed by the thought of customizing her own workout but luckily she has Git Fit which makes it easy to start her calf building journey. She starts by calling the search exercises endpoint and searches by the calf muscle group and looks at the exercise list available. She finds an exercise she likes that has an exercise id of 2 and proceeds to add the exercise by calling the add exercise endpoint and inputting the exercise id. Feeling inspired, she decides she wants to create an exercise of her own so she calls the create exercise endpoint inputting the name of the exercise, the muscle group, and equipment needed. She gets back an exercise id and then adds this exercise to her workout. She continues these steps and adds over 10 new calf exercises to her workout. Then, she decides that she actually really enjoys her small calves and deletes her workout by calling the delete workout endpoint. 
