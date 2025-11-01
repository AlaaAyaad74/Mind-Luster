# MindLuster - To-Do List Task Management Application

A Kanban-style task management application built with React, TypeScript, and React Query.

## Features

- 4-column Kanban board (Backlog, In Progress, Review, Done)
- Drag-and-drop to move tasks between columns
- Create, edit, and delete tasks
- Search tasks by title or description
- Pagination for each column
- Modern UI with color-coded columns

## Tech Stack

- React 19 + TypeScript
- Vite
- React Query
- Bootstrap 5
- @dnd-kit (drag-and-drop)
- JSON Server (mock API)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run the Application

1. **Start JSON Server** (in one terminal):

```bash
npm run server
```

2. **Start Dev Server** (in another terminal):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── models/         # TypeScript types
├── svgs/           # Icon components
├── api.ts          # API functions
└── App.tsx         # Main component
```

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run server` - Start JSON Server
