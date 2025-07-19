# ContraMan API (WIP)

This is the backend API for **ContraMan** — a platform that helps small businesses in the construction, painting, and service industries manage jobs, tasks, and
teams with modern tools.

## 🚀 Features

- User & Bot authentication system (OAuth + API Keys)
- Company & member management (roles, guests, static members)
- CrewCalls: post jobs, accept bids, manage work
- Messaging & notifications
- WebSocket support for real-time updates
- Audit logging for traceability

## 🧱 Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: OAuth 2.0 + Static API keys for bots
- **WebSockets**: Socket.IO (platform → bot communication)
- **REST API**: JSON-based endpoints (bot → platform)
- **ORM**: Kysely

## 📂 Folder Structure

```
/src
  /routes          → Express route definitions
  /services        → Business logic layer
  /middleware      → Auth, error handling, etc.
  /utils           → Helpers and shared utilities
  /sockets         → WebSocket handlers
```

## 🧪 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/kontractors/contraman-api.git
cd contraman-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create `.env` file from `.env.example`

Copy the example environment variables file and fill in your configuration:

```bash
cp .env.example .env
```

### 4. Run the server

```bash
npm run dev
```

## 🧾 API Overview

### Auth

- `POST /auth/forgot-password` — Start password recovery flow
- `POST /auth/reset-password` — Reset password with token
- `POST /auth/signup` — Register new user
- `POST /auth/login` — Sign in user - returns refresh token that can be used to get access token
- `POST /auth/verify-email` — Verify email address with token
- `GET /auth/webauthn/login` — Get WebAuthn options for login
- `POST /auth/webauthn/login` — Login using WebAuthn credential - returns refresh token that can be used to get access token
- `🔐 POST /auth/refresh` — Returns new access token using the refresh token that was returned on login
- `🔐 POST /auth/logout` — Logout user - invalidates refresh token
- `🔐 POST /auth/verify` — Verify any arbitrary token (e.g. email verification, phone verification)
- `🔐 GET /auth/webauthn/register` — Get WebAuthn options for registration
- `🔐 POST /auth/webauthn/register` — Register new WebAuthn credential