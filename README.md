# TaskHQ — Real-time Collaborative Task Manager

> A full-stack productivity application built in 72 hours as part of a competitive Full-Stack / Deployment assignment. Built with React, Node.js (TypeScript), PostgreSQL (via Supabase), and Prisma ORM — featuring Google authentication, role-based access control, and live task updates.

---

## Live Demo

**https://task-manager-bqo2.vercel.app/**
> Backend and Frontend deployed on Vercel· Database hosted on Supabase

---

## Screenshots

> <img width="1897" height="905" alt="image" src="https://github.com/user-attachments/assets/c94850c0-e7c0-4d05-bdfc-aad7b3f286f0" />
<img width="1886" height="858" alt="image" src="https://github.com/user-attachments/assets/029a3ce7-f4fb-4cc4-9d0a-8dcdd3bdabe7" />
<img width="1886" height="893" alt="image" src="https://github.com/user-attachments/assets/3d9419ec-9e29-43fa-8951-95eddf659711" />




---

## The Idea

Most task managers treat every user the same. This one doesn't.

Collabify is built around a deliberate role hierarchy — there is one **Admin**, and everyone else is a **User**. Users can create and manage their own tasks freely. Only the Admin can assign tasks to others, keeping accountability centralised while still giving individuals autonomy over their own work.

The project was conceived, designed, and built entirely within a 72-hour window as part of Assignment 4 of a Full-Stack Development track. Every architectural decision — from the database schema to the real-time subscription model — was made with that constraint in mind.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + TypeScript (Vite) | Fast dev server, strong typing, component model |
| Styling | Tailwind CSS | Utility-first styling with smooth, production-feel animations |
| Auth | Supabase Auth (Google OAuth) | One-click Google login with JWT tokens, zero auth server to maintain |
| Backend | Node.js + Express + TypeScript | Full control over business logic and role enforcement |
| ORM | Prisma | Type-safe database queries, clean migration workflow |
| Database | PostgreSQL via Supabase | Managed Postgres with built-in Realtime engine |
| Real-time | Supabase Realtime (Postgres Changes) | Live task updates without polling or WebSocket setup |
| Deployment | Vercel (frontend) + Railway (backend) | Zero-config deployments with environment variable management |

---

## 🏗️ Architecture

The application follows a clean **three-tier architecture**. Supabase acts purely as an infrastructure provider — it hosts the PostgreSQL database and handles OAuth. The Express backend sits in the middle, enforcing all business rules. The React frontend communicates exclusively through the Express API, never touching the database directly.

```
┌─────────────────────────────────────────────────┐
│                   React Frontend                │
│         (Vite + TypeScript + Tailwind)          │
└────────────────────┬────────────────────────────┘
                     │  HTTP + Bearer JWT
┌────────────────────▼────────────────────────────┐
│               Express Backend                   │
│         (TypeScript + JWT Middleware)           │
│    Role enforcement · Business logic layer      │
└────────────────────┬────────────────────────────┘
                     │  Prisma ORM
┌────────────────────▼────────────────────────────┐
│          PostgreSQL via Supabase                │
│    Users · Tasks · Roles · Realtime Engine      │
└─────────────────────────────────────────────────┘
```

Authentication flow:
1. User clicks **Sign in with Google** on the frontend
2. Supabase handles the OAuth dance and returns a signed JWT
3. Frontend sends that JWT as a `Bearer` token with every API request
4. Express middleware verifies the JWT against Supabase's public key
5. On first login, the backend upserts the user into the Prisma `User` table and assigns their role
6. The role (`ADMIN` or `USER`) travels back to the frontend and lives in `AuthContext` for the rest of the session

---

## 🔐 Role System

The modified spec was intentional. Instead of allowing any user to assign tasks to anyone (as the original brief suggested), I implemented a stricter model:

- **Admin** — a single privileged account identified by email address at sync time. Can create tasks, assign them to any registered user by email, and view all tasks across the system.
- **User** — can create, edit, delete, and complete their own tasks. Cannot assign work to others. Only sees their own tasks on their dashboard.

This is enforced at the **API layer**, not just the UI. Even if a user manipulates the frontend, the Express routes verify the role on every mutating request before any Prisma query is made.

---

## ✨ Features

**For everyone**
- Google Sign-In — one click, no passwords
- Personal task dashboard with live updates
- Create, edit, delete, and mark tasks complete
- Status tracking: `TODO` → `IN PROGRESS` → `DONE`
- Loading skeletons while data fetches
- Success and error toast notifications
- Fully responsive — works on mobile, tablet, and desktop

**For Admin only**
- View all tasks across all users
- Assign tasks to any user by entering their email address
- Error feedback when the target email isn't registered
- User list panel for managing the team

**Real-time**
- Task assignments appear on the recipient's dashboard instantly — no refresh required
- Powered by Supabase Realtime listening to Postgres change events
- New and updated task cards animate in with a brief highlight

---

## 🗂️ Project Structure

```
collabify/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Session state, dbUser, isAdmin, signOut
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx    # Redirects unauthenticated users
│   │   │   ├── TaskCard.tsx          # Individual task display + actions
│   │   │   ├── CreateTaskModal.tsx   # Create/edit form (admin sees assign field)
│   │   │   └── AssignTaskModal.tsx   # Admin-only email assign flow
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/
│   │   │   └── useRealtimeTasks.ts   # Supabase Realtime subscription
│   │   └── lib/
│   │       └── supabase.ts           # Supabase client initialisation
│   └── ...
│
└── backend/
    ├── src/
    │   ├── routes/
    │   │   ├── auth.ts               # POST /api/auth/sync
    │   │   ├── tasks.ts              # Full task CRUD
    │   │   └── users.ts              # GET /api/users (admin only)
    │   ├── middleware/
    │   │   ├── auth.ts               # JWT verification via Supabase
    │   │   └── isAdmin.ts            # Role guard for admin routes
    │   ├── lib/
    │   │   └── prisma.ts             # Prisma client singleton
    │   └── index.ts                  # Express app entry point
    └── prisma/
        └── schema.prisma
```

---

## 🗃️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  tasks     Task[]   @relation("AssignedTasks")
  createdAt DateTime @default(now())
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  assignedTo  User?      @relation("AssignedTasks", fields: [userId], references: [id])
  userId      String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Role       { ADMIN USER }
enum TaskStatus { TODO IN_PROGRESS DONE }
```

---

## 🤖 AI-Assisted Development

This project was built with the help of **Claude (Anthropic)** as a development partner throughout the 72-hour window. AI assistance was used in the following ways:

- **Project planning** — breaking the assignment into a sequenced 57-task timeline with hour estimates per phase, helping prioritise what to build first given the time constraint
- **Architecture decisions** — deciding on the Express-as-middleware pattern (Supabase for DB + Auth, Express for business logic) rather than going serverless, and understanding the tradeoffs
- **Debugging auth flow** — the double-sync problem in `App.tsx` where `getSession()` and `onAuthStateChange` were both triggering backend sync on page refresh was caught and explained through AI code review
- **Code review** — reviewing `AuthContext.tsx` structure, understanding why `ProtectedRoute` should gate on `user` (Supabase) rather than `dbUser` (Prisma) to avoid the login flash during sync
- **Boilerplate acceleration** — middleware patterns, Prisma upsert syntax, Supabase Realtime subscription setup

Every piece of code was understood, modified where needed, and consciously integrated. AI was used as a senior developer to think alongside — not as a code generator to paste from blindly.

---

## 🧱 Difficulties Faced

Building a full-stack application with deployment in 72 hours is not a gentle experience. Here's what actually got in the way.

**The double-sync problem**
The first version of `App.tsx` called `syncUserWithBackend` in both `getSession()` and `onAuthStateChange`. On a fresh login this was fine — `getSession` found nothing and skipped it. But on page refresh, both fired. The backend upsert handled duplicates gracefully so it didn't break anything, but it took a while to notice it was happening at all. The fix was simple once understood — sync only in `onAuthStateChange`, restore state only in `getSession`.

**Two users, one session**
Supabase gives you a `User` object immediately. Your Prisma `DbUser` (with the role) comes back async from the backend sync. There's a real window where `user !== null` but `dbUser === null`. Getting `ProtectedRoute`, `AuthContext`, and the admin UI to behave correctly during that window — without flashing the login page or showing the wrong UI — required careful thought about which object to gate on at which point.

**JWT verification on Express**
Supabase's JWT verification is not as simple as `jwt.verify(token, secret)`. Supabase uses asymmetric RS256 signing, and the public key is fetched from a JWKS endpoint. Getting the middleware right — handling token expiry, malformed tokens, and missing headers with clean error responses — took several iterations.

**Supabase Realtime permissions**
Realtime subscriptions silently return nothing if Row Level Security is enabled and the policy doesn't allow the subscription. There were no errors — the channel just never fired. The fix was ensuring the correct RLS policy existed on the `Task` table, but the silence made it genuinely hard to debug.

**Environment variables across three environments**
Local `.env`, Railway, and Vercel each handle environment variables slightly differently. Vite requires `VITE_` prefixes. Railway injects them at runtime. Vercel needs them set per-environment. Getting all three aligned — especially the Supabase redirect URLs and the API URL — caused the first deployed version to break auth silently until each mismatch was tracked down.

**TypeScript strictness**
Starting with strict TypeScript on both frontend and backend meant more upfront friction but fewer runtime surprises. The discipline of typing the `DbUser` separately from Supabase's `User`, and making `AuthContextType` explicit, paid off significantly when wiring the admin UI — there was no guessing what shape the data was.

---

## 🚀 Running Locally

**Prerequisites:** Node.js 18+, a Supabase project, Google OAuth credentials

```bash
# Clone the repo
git clone https://github.com/yourusername/collabify.git
cd collabify
```

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL
npx prisma migrate dev
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
npm run dev
```

---


## 📄 License

MIT — do whatever you want with it.

---

<p align="center">Built under pressure, with intention — and a little help from AI.</p>
