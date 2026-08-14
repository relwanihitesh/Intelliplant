# IntelliPlant — Industrial Knowledge Assistant

An AI-powered knowledge assistant for industrial teams. Employees ask questions in plain language
and get answers sourced from their company's own uploaded documents (RAG) — not the open internet.
Access is role- and department-restricted (RBAC).

## Live Links

- Backend API: https://intelliplant-backend-lacy.onrender.com
- Frontend: (add your Vercel/Netlify URL here once deployed)

## Project Structure

This is a monorepo containing two independent apps:

IntelliPlant/
├── intelliplant-backend/ — Node.js + Express REST API (Auth, Documents, AI/RAG, Search)
├── intelliplant-frontend/ — React + Vite console (UI for the above)

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, ImageKit (file storage),
Google Gemini (LLM + embeddings), Pinecone (vector database), LangChain (chunking), Zod (validation),
Winston + Morgan (logging), Resend (email), Jest + Supertest (testing).

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios.

## Key Features

- JWT authentication with email verification
- Role-based access control (Admin / Manager / Employee) scoped by department
- Document upload → automatic text extraction, chunking, embedding, and vector indexing
- RAG-based AI chat — answers are grounded only in indexed company documents, with cited sources
- Basic (keyword) and semantic (meaning-based) document search
- Chat history per user

## Running Locally

### Backend
\`\`\`bash
cd intelliplant-backend
npm install
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd intelliplant-frontend
npm install
npm run dev
\`\`\`

## Deployment

- **Backend** is deployed on Render, with the service's Root Directory set to `intelliplant-backend`.
- **Frontend** is deployed on Vercel, with the Root Directory set to `intelliplant-frontend`.
- The backend's CORS `origin` must match the frontend's deployed URL exactly.