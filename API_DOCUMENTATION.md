# API Documentation

Base URL: `http://localhost:4000`

All task routes require an `Authorization` header:
`Authorization: Bearer <JWT>`

## Auth Endpoints

### `POST /api/auth/register`
Registers a user.

Request body:
```json
{ "email": "user@example.com", "password": "password123" }
```

Response `201`:
```json
{
  "token": "<jwt>",
  "user": { "id": "60f...abc", "email": "user@example.com" }
}
```

### `POST /api/auth/login`
Logs a user in.

Request body:
```json
{ "email": "user@example.com", "password": "password123" }
```

Response `200`:
```json
{
  "token": "<jwt>",
  "user": { "id": "60f...abc", "email": "user@example.com" }
}
```

### `POST /api/auth/logout`
Invalidates the current access token (in-memory blacklist).

Response `204`: empty body.

## Task Endpoints (Protected)

### `POST /api/tasks`
Create a task.

Request body:
```json
{
  "title": "My task",
  "description": "Optional description",
  "dueDate": "2026-01-01",
  "priority": "high",
  "status": "todo"
}
```

Response `201` (task object):
```json
{
  "_id": "60f...abc",
  "userId": "60f...u",
  "title": "My task",
  "description": "Optional description",
  "dueDate": "2026-01-01T00:00:00.000Z",
  "priority": "high",
  "status": "todo",
  "createdAt": "..."
}
```

### `GET /api/tasks`
List tasks for the authenticated user.

Optional query params:
- `status`: `todo | in-progress | done`
- `priority`: `low | medium | high`

Response `200`:
```json
{ "tasks": [ { "...": "..." } ] }
```

### `PATCH /api/tasks/:id`
Partial update a task (owned by the authenticated user).

Request body example:
```json
{ "status": "done" }
```

Response `200`: updated task object.

### `PUT /api/tasks/:id`
Full update a task (owned by the authenticated user).

Request body:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-02-01",
  "priority": "medium",
  "status": "in-progress"
}
```

Response `200`: updated task object.

### `DELETE /api/tasks/:id`
Delete a task (owned by the authenticated user).

Response `200`:
```json
{ "message": "Task deleted" }
```

## Error Responses (Common)
- `400` invalid input
- `401` missing/invalid token (or token invalidated via logout)
- `403` forbidden (not used heavily here because ownership is enforced by query filters)
- `404` task not found (including cross-user attempts)
- `500` server error

