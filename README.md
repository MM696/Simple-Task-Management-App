# Task Management App (Technical Assessment)

## Description
Lightweight full-stack task management application with secure JWT authentication and per-user task CRUD. Each task is owned by exactly one user, and the API enforces ownership at the database query level.

## Tech Stack
- Backend: Node.js and Express (REST API), JWT (access tokens), bcrypt, Mongoose (MongoDB)
- Frontend: React (Vite), Axios, React Router
- Validation: Zod
- Tests (bonus): Jest and Supertest and mongodb-memory-server

## Requirements
- Node.js 18 above (recommended: 20 above)
- MongoDB running locally (or update `DATABASE_URL` to point to your Mongo instance)

## Project Structure
- `backend/` - Express API
- `frontend/` - React UI

## Setup (Step-by-step)
1. Install backend dependencies
   - `cd backend`
   - `npm install`
2. Configure environment variables
   - Copy `../.env.example` to `./.env` (or edit `backend/.env` directly)
   - Ensure `DATABASE_URL` points to your MongoDB
3. Run the backend
   - `npm run dev`
   - Backend default port: `4000`
4. Install frontend dependencies
   - `cd ../frontend`
   - `npm install`
5. Run the frontend
   - `npm run dev`
   - Frontend default port: `5173`

## API Base URLs
- Backend: `http://localhost:4000`
- Frontend uses Vite proxy for `/api` requests.

## Environment Variables
Backend uses these variables from `.env`:
- `PORT` (default: `4000`)
- `DATABASE_URL` (MongoDB connection string)
- `JWT_SECRET` (must be at least 16 characters)

## Running Tests (bonus)
From `backend/`:
- `npm test`

## How Logout Works
This project uses access tokens with a lightweight in-memory token blacklist.
- Calling `POST /api/auth/logout` invalidates the current JWT (until server restart).
- Frontend removes the token from `localStorage` after logout.

## Endpoints (high level)
Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Tasks (all protected):
- `POST /api/tasks`
- `GET /api/tasks?status=&priority=`
- `PATCH /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

More details are in `API_DOCUMENTATION.md` and `postman_collection.json`.

