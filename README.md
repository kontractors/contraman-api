# ContraMan API (WIP)

This is the backend API for **ContraMan** — a platform that helps small businesses in the construction, painting, and service industries manage jobs, tasks, and
teams with modern tools.

<!-- TOC -->
* [ContraMan API (WIP)](#contraman-api-wip)
  * [Features](#features)
  * [Tech Stack](#tech-stack)
  * [Folder Structure](#folder-structure)
  * [Setup Instructions](#setup-instructions)
    * [Prerequisites](#prerequisites)
    * [Development](#development)
    * [Production](#production)
  * [API Overview](#api-overview)
    * [Auth](#auth)
<!-- TOC -->

## Features

- User & Bot authentication system (OAuth + API Keys)
- Company & member management (roles, guests, static members)
- CrewCalls: post jobs, accept bids, manage work
- Messaging & notifications
- WebSocket support for real-time updates
- Audit logging for traceability

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: OAuth 2.0 + Static API keys for bots
- **WebSockets**: Socket.IO (platform → bot communication)
- **REST API**: JSON-based endpoints (bot → platform)
- **ORM**: Kysely (for auto-generating types from the db, and type-safe queries)

## Folder Structure

```
/src
  /routes          → Express route definitions
  /services        → Business logic layer
  /middleware      → Auth, error handling, etc.
  /utils           → Helpers and shared utilities
  /sockets         → WebSocket handlers
```

## Setup Instructions

### Prerequisites
```bash
git clone https://github.com/kontractors/contraman-api.git
cd contraman-api
cp .env.example .env.development
```

### Development

**Without Docker:**
```bash
pnpm install
npm run dev
```

**With Docker:**
```bash
docker-compose up

# API will be available at http://localhost:3000
```

### Production

**Without Docker:**
```bash
pnpm install  # Install dependencies
cp .env.example .env.production # Copy and configure your environment variables
npm run build # Builds the application into the dist folder
npm run start # Start the application from the dist folder

# API will be available at http://localhost:3000
```

**With Docker:**

```bash
# Option 1: Using .env.production file
cp .env.example .env.production
docker-compose -f docker-compose.prod.yml up -d

# Option 2: Inline environment variables
docker-compose -f docker-compose.prod.yml up -d --build -e VAR_NAME=value

# API will be available at http://localhost:3000
```

**Note:** Docker setup requires external PostgreSQL database as configured in your environment file.

## API Overview

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