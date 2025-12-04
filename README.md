<!-- Project README for ExpertHub / SkillBridge -->

# ExpertHub (SkillBridge)

Minimal README for the ExpertHub / SkillBridge repository. This project contains a React + Vite frontend and an Express + Socket.IO backend (located in `backend/`).

This README covers quick setup, how to run the app locally, important backend endpoints, environment variables, and troubleshooting tips.

---

## Quick start

1. Install dependencies for the frontend (root):

```powershell
npm install
```

2. Install dependencies for the backend:

```powershell
cd backend
npm install
```

3. Start the development servers in separate terminals:

Frontend (run in repo root):

```powershell
npm run dev
```

Backend (run from `backend/`):

```powershell
cd backend
npm run dev
```

By default the frontend runs on Vite's port (5173 or next available) and the backend listens on port `5000`.

---

## Project layout

- `backend/` - Express API, Socket.IO server, MongoDB models and upload handling.
- `src/` - Frontend React application (Vite).

---

## Backend: important endpoints

- `GET /profile/:userId` — fetch a user's profile
- `PUT /profile/:userId` — update or upsert a profile
- `POST /profile/upload/:userId` — upload profile image (multipart/form-data)
- `GET /profiles` — list public profiles
- `POST /register` — register new user
- `POST /login` — login
- `GET /messages/:user1/:user2` — fetch chat history
- `DELETE /messages/:user1/:user2` — clear chat history
- `POST /send-otp` — send an OTP email (used for password recovery flows)

Test meeting link endpoint (no external API keys required):

- `GET /api/test-meetings/generate-test-links` — returns mock Zoom + Teams join URLs useful for development.

Socket.IO:

- The backend exposes a Socket.IO server (same host:port as Express). Clients should connect to `http://localhost:5000` (or whichever `PORT` is configured).

---

## Environment variables

Create a `.env` file in `backend/` with the variables your environment needs. Common variables used in this project:

- `PORT` — port the backend listens on (default: 5000)
- `MONGO_URI` — MongoDB connection string
- `EMAIL_USER` — Gmail or SMTP user for sending OTPs
- `EMAIL_PASS` — SMTP password or app-specific password

If you integrate Zoom or Microsoft Graph later you will need API credentials and to store them in the `.env` file as well.

---

## Frontend notes

- Frontend connects to Socket.IO on the backend. If you run the frontend on a different port (Vite may use 5174 if 5173 is busy) make sure the backend CORS configuration allows that origin.
- Run `npm run dev` from the repo root to start Vite's dev server.

---

## Troubleshooting

- `nodemon` not recognized when running `npm run dev` from the repo root: this happens when the root `package.json` is for the frontend (Vite) and not the backend. Use the commands above: run the frontend from the repo root and the backend from `backend/`.
- CORS / Socket.IO connection blocked: ensure backend CORS allows the actual frontend origin (e.g. `http://localhost:5173` or `http://localhost:5174`). If you see errors like `Access-Control-Allow-Origin header has a value 'http://localhost:5173' that is not equal to the supplied origin` update the backend CORS origins.
- Port in use errors (`EADDRINUSE: address already in use :::5000`): either stop the process already listening on that port or change the backend `PORT` environment variable.

---

## Development tips

- Use React DevTools for debugging the frontend: https://reactjs.org/link/react-devtools
- When adding external meeting integrations (Zoom / Teams) prefer server-side creation of meetings and return only the join URL to the client. Protect API keys and ensure required OAuth scopes are granted.

---

If you want, I can also add a short `CONTRIBUTING.md` or add more documentation for the backend routes and the frontend routes. Tell me which area you'd like expanded.

---

License: MIT-style (add an appropriate license file if needed)

