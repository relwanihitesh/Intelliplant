# IntelliPlant — Frontend

React + Vite + Tailwind CSS console for the IntelliPlant backend — an AI knowledge assistant that
answers employee questions using only a company's own uploaded documents (RAG), with role-based
access control per department.

## Features covered

- **Auth** — register, login, 6-digit email verification, protected routes
- **Document library** — browse, keyword search, and *semantic* ("ask by meaning") search
- **AI Chat** — ask questions in natural language, get answers with cited source documents,
  session history
- **Document upload** (admin) — drag-and-drop PDF upload, tied to a department
- **Department management** (admin) — create / edit / delete
- **Profile** — update details, change password, delete account
- Role-aware navigation (admin-only screens are hidden for regular employees, matching backend RBAC)

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v6
- Axios (cookie-based auth, matches the backend's JWT-in-cookie flow)
- lucide-react icons

## Getting started

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL if needed
npm run dev
```

The app runs at `http://localhost:5173`.

## Connecting to your backend

Edit `.env`:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

It's pre-filled with the deployed backend URL used during development. Point it at `http://localhost:3000/api`
if you're running the backend locally instead.

### Important — CORS

The backend's `cors()` config only allows requests from one `origin`. Update it (in the backend's `app.js`)
to match wherever this frontend is actually served from, e.g.:

```js
app.use(cors({
  origin: "https://your-frontend.vercel.app", // or http://localhost:5173 during dev
  credentials: true
}))
```

Without this, the browser will block login/API requests even though Postman would work fine.

## Building for production

```bash
npm run build
```

Outputs to `dist/`. Deploy that folder to Vercel, Netlify, or any static host.

**Vercel:** import this folder as a project, framework preset "Vite", and add the `VITE_API_URL`
environment variable in the project settings before deploying.

## Project structure

```
src/
├── components/       # Sidebar, layout, route guards, UI primitives
├── context/           # AuthContext — current user, login/register/logout
├── lib/                # axios instance, shared constants (departments, roles)
├── pages/              # one file per screen
└── index.css           # design tokens (colors, fonts) + Tailwind import
```

## Design direction

An "industrial control room" aesthetic — graphite panels, amber signal-lamp accent for primary
actions/admin, teal for AI/semantic features, monospace for IDs/timestamps/status readouts. Meant to
feel like the plant-floor knowledge system it actually is, rather than a generic SaaS dashboard.
