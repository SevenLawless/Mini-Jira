# Database Plan
# Database Plan

The project uses MySQL during local development.

Database name : bug_tracker_dev


## Create the database locally

Open MySQL Workbench and run:

```sql
CREATE DATABASE bug_tracker_dev;
```


## Main Tables

### users

Stores registered users.

Fields:

- id
- name
- email
- password_hash
- created_at
- updated_at

### workspaces

Stores teams or organizations.

Fields:

- id
- name
- owner_id
- created_at
- updated_at

### workspace_members

Connects users to workspaces.

Fields:

- id
- workspace_id
- user_id
- role
- created_at

Roles:

- owner
- admin
- member
- viewer

### projects

Stores projects inside workspaces.

Fields:

- id
- workspace_id
- name
- description
- created_at
- updated_at

### board_columns

Stores workflow columns for each project.

Fields:

- id
- project_id
- name
- position
- created_at
- updated_at

Default columns:

- Backlog
- To Do
- In Progress
- Review
- Done

### tasks

Stores tasks, bugs, and issues.

Fields:

- id
- project_id
- column_id
- title
- description
- priority
- assignee_id
- created_by_id
- due_date
- position
- created_at
- updated_at

Priority values:

- low
- medium
- high
- urgent

### comments

Stores comments on tasks.

Fields:

- id
- task_id
- user_id
- content
- created_at
- updated_at

### activity_logs

Stores important user actions.

Fields:

- id
- workspace_id
- project_id
- task_id
- user_id
- action
- details
- created_at