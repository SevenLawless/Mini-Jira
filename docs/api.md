# API Plan

## Auth

### POST /api/auth/register

Create a new user account.

### POST /api/auth/login

Log in an existing user.

### POST /api/auth/logout

Log out the current user.

### GET /api/auth/me

Get the current logged-in user.

---

## Workspaces

### GET /api/workspaces

Get all workspaces for the current user.

### POST /api/workspaces

Create a new workspace.

### GET /api/workspaces/:workspaceId

Get one workspace.

### PATCH /api/workspaces/:workspaceId

Update a workspace.

### DELETE /api/workspaces/:workspaceId

Delete a workspace.

---

## Projects

### GET /api/workspaces/:workspaceId/projects

Get all projects inside a workspace.

### POST /api/workspaces/:workspaceId/projects

Create a project.

### GET /api/projects/:projectId

Get one project.

### PATCH /api/projects/:projectId

Update a project.

### DELETE /api/projects/:projectId

Delete a project.

---

## Tasks

### GET /api/projects/:projectId/tasks

Get all tasks for a project.

Query filters:

- status
- priority
- assignee
- keyword

### POST /api/projects/:projectId/tasks

Create a task.

### GET /api/tasks/:taskId

Get one task.

### PATCH /api/tasks/:taskId

Update a task.

### DELETE /api/tasks/:taskId

Delete a task.

### PATCH /api/tasks/:taskId/move

Move a task to another column or position.

---

## Comments

### GET /api/tasks/:taskId/comments

Get comments for a task.

### POST /api/tasks/:taskId/comments

Add a comment to a task.

### PATCH /api/comments/:commentId

Update a comment.

### DELETE /api/comments/:commentId

Delete a comment.

---

## Activity Logs

### GET /api/tasks/:taskId/activity

Get activity history for a task.

### GET /api/projects/:projectId/activity

Get activity history for a project.