# Technical Decisions

This file records important decisions made during the project.

## Decision 1 — Build MVP First

The first goal is to build a working MVP before adding advanced features.

MVP features include:

- authentication
- workspaces
- projects
- tasks
- board columns
- comments
- activity log
- search and filters

Advanced features such as AI summaries, email notifications, file uploads, and real-time collaboration will be added later only if the MVP is complete.

## Decision 2 — Keep the App Practical

The project should solve a real team workflow problem.

Every feature should support one of these goals:

- tracking bugs
- organizing tasks
- managing projects
- helping team members collaborate
- showing clear project history

## Decision 3 — Avoid Feature Creep

Features outside the MVP should not be built early.

Examples of postponed features:

- payments
- advanced analytics
- AI summaries
- real-time multiplayer
- mobile app
- complex organization billing

## Decision 4 — Use Local MySQL During Development

The project will use a local MySQL database during the development phase.

MySQL Workbench will be used to view and manage the database locally.

The goal right now is to build and test the MVP without paying for hosting services.

Deployment will be handled later after the app works locally.

Current development stack:

- Frontend: React
- Backend: Express.js
- Database: Local MySQL
- Database client: MySQL Workbench
- Authentication: JWT