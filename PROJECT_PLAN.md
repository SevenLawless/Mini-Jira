# Bug Tracking / Mini Jira — Project Plan

## 1. Project Goal

Build a lightweight bug-tracking and project management web app for small teams.

The app should help users create workspaces, manage projects, create tasks/bugs, move them through workflow columns, discuss progress with comments, and track activity.

This project is inspired by tools like Jira, Linear, and Trello, but the goal is not to clone them fully. The goal is to build a clean, useful MVP that demonstrates real-world full-stack development skills.

---

## 2. Target Users

### Workspace Owner
The person who creates a workspace and manages team members.

### Admin
A trusted member who can manage projects, tasks, members, and workspace settings.

### Member
A regular team member who can create, update, assign, and comment on tasks.

### Viewer
A read-only user who can view projects and tasks but cannot edit them.

---

## 3. Core Features

### Authentication
Users can register, log in, log out, and access protected pages.

### Workspaces
Users can create workspaces and invite/manage members.

### Projects
Each workspace can contain multiple projects.

### Board Columns
Each project has workflow columns such as:

- Backlog
- To Do
- In Progress
- Review
- Done

### Tasks / Issues
Users can create and manage tasks with:

- title
- description
- status
- priority
- assignee
- due date
- labels
- project
- created by
- timestamps

### Drag-and-Drop Board
Users can move tasks between columns using drag-and-drop.

### Comments
Users can comment on tasks to discuss progress or problems.

### Activity Log
The app records important actions such as:

- task created
- task updated
- task moved
- comment added
- assignee changed
- priority changed

### Search and Filters
Users can filter tasks by:

- status
- priority
- assignee
- project
- label
- keyword

---

## 4. MVP Scope

The first version must include:

1. User authentication
2. Workspace creation
3. Project creation
4. Board columns
5. Task CRUD
6. Drag-and-drop task movement
7. Comments
8. Activity log
9. Search and filters
10. Basic responsive UI
11. GitHub README with setup instructions
12. Seed/demo data

---

## 5. Out of Scope for MVP

These features should not be built in the first version:

- payments
- real-time multiplayer editing
- advanced analytics
- AI task summary
- email notifications
- file uploads
- mobile app
- complex permission system
- organization billing
- public project sharing

They can be added later after the MVP works.

---

## 6. Main Data Models

### User
Represents a registered user.

Fields:

- id
- name
- email
- password_hash
- created_at
- updated_at

### Workspace
Represents a team or organization.

Fields:

- id
- name
- owner_id
- created_at
- updated_at

### WorkspaceMember
Connects users to workspaces with roles.

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

### Project
Represents a project inside a workspace.

Fields:

- id
- workspace_id
- name
- description
- created_at
- updated_at

### BoardColumn
Represents a workflow column inside a project.

Fields:

- id
- project_id
- name
- position
- created_at
- updated_at

### Task
Represents a bug, task, or issue.

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

### Comment
Represents a comment on a task.

Fields:

- id
- task_id
- user_id
- content
- created_at
- updated_at

### ActivityLog
Stores important project actions.

Fields:

- id
- workspace_id
- project_id
- task_id
- user_id
- action
- details
- created_at

---

## 7. Milestones

### M0 — Project Setup and Planning

Goal: Prepare the repo and project structure.

Tasks:

- Create GitHub repository
- Add README.md
- Add PROJECT_PLAN.md
- Add CONTRIBUTING.md
- Add docs folder
- Set up frontend project
- Set up backend project
- Set up database connection
- Add environment variable example file
- Create initial GitHub commit

Acceptance Criteria:

- Project runs locally
- Repo has clear setup instructions
- Folder structure is clean
- Future contributors can understand the project goal

---

### M1 — Authentication

Goal: Allow users to register and log in.

Tasks:

- Create user model/table
- Create register endpoint
- Create login endpoint
- Hash passwords
- Add protected route middleware
- Create login page
- Create register page
- Store auth token/session
- Add logout button

Acceptance Criteria:

- User can register
- User can log in
- User can log out
- Protected pages cannot be accessed without login

---

### M2 — Workspaces and Members

Goal: Allow users to create a workspace and belong to it.

Tasks:

- Create workspace model/table
- Create workspace member model/table
- Create workspace creation endpoint
- Add default owner role
- Create workspace dashboard page
- Show current user’s workspaces
- Add basic role checking

Acceptance Criteria:

- Logged-in user can create a workspace
- Workspace owner is saved correctly
- User can view their own workspace dashboard
- Unauthorized users cannot access another workspace

---

### M3 — Projects and Board Columns

Goal: Allow workspaces to have projects and workflow columns.

Tasks:

- Create project model/table
- Create board column model/table
- Create project CRUD endpoints
- Create default board columns when a project is created
- Build project list page
- Build project board page
- Display columns on board

Acceptance Criteria:

- User can create a project inside a workspace
- New projects get default columns
- User can view the project board
- Columns display in the correct order

---

### M4 — Tasks / Issues CRUD

Goal: Allow users to create and manage tasks.

Tasks:

- Create task model/table
- Create task CRUD endpoints
- Add task creation form
- Display tasks inside board columns
- Add task detail view
- Add edit task form
- Add delete task option
- Add priority and assignee fields

Acceptance Criteria:

- User can create a task
- User can view task details
- User can edit a task
- User can delete a task
- Tasks appear in the correct project and column

---

### M5 — Drag-and-Drop Workflow

Goal: Allow users to move tasks between columns.

Tasks:

- Add drag-and-drop UI
- Update task column when dropped
- Save new task status in database
- Save task position/order
- Prevent invalid moves if needed

Acceptance Criteria:

- User can drag task from one column to another
- Task status updates immediately in the UI
- Task status stays updated after refresh
- Task order is saved correctly

---

### M6 — Comments and Activity Log

Goal: Allow collaboration and history tracking.

Tasks:

- Create comments model/table
- Add comment creation endpoint
- Add comment list for each task
- Add activity log model/table
- Record task creation
- Record task updates
- Record task movement
- Record comments
- Display activity history on task detail page

Acceptance Criteria:

- User can comment on a task
- Comments are saved and displayed
- Important task actions are recorded
- Task history is visible

---

### M7 — Search and Filters

Goal: Make the app usable with many tasks.

Tasks:

- Add keyword search
- Add filter by status
- Add filter by priority
- Add filter by assignee
- Add filter by project
- Add filter UI on project board
- Connect filters to backend query

Acceptance Criteria:

- User can search tasks by keyword
- User can filter tasks by priority
- User can filter tasks by assignee
- Filters work without breaking the board

---

### M8 — Polish, Testing, and Deployment

Goal: Make the project portfolio-ready.

Tasks:

- Add seed/demo data
- Improve UI spacing and layout
- Handle loading states
- Handle empty states
- Handle error messages
- Add basic validation
- Clean code structure
- Add screenshots to README
- Add API documentation
- Deploy frontend
- Deploy backend
- Test deployed version

Acceptance Criteria:

- App has a working deployed demo
- README explains how to run the project
- README includes screenshots
- Demo data makes the app easy to test
- Project is ready to show on CV/GitHub