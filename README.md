# ContraMan API (WIP)

This is the backend API for **ContraMan** — a platform that helps small businesses in the construction, painting, and service industries manage jobs, tasks, and
teams with modern tools.

<!-- TOC -->
* [ContraMan API (WIP)](#contraman-api-wip)
  * [Features](#features)
  * [Tech Stack](#tech-stack)
  * [Folder Structure](#folder-structure)
  * [Running Locally](#running-locally)
    * [Option 1: Without Docker](#option-1-without-docker)
      * [1. Clone the repo](#1-clone-the-repo)
      * [2. Install dependencies](#2-install-dependencies)
      * [3. Create `.env` file from `.env.example`](#3-create-env-file-from-envexample)
      * [4. Run the server](#4-run-the-server)
    * [Option 2: With Docker (Development)](#option-2-with-docker-development)
      * [1. Create a `.env` file from `.env.example`](#1-create-a-env-file-from-envexample)
      * [2. Start the Docker container](#2-start-the-docker-container)
  * [Production Deployment](#production-deployment)
      * [1. Set up production environment variables](#1-set-up-production-environment-variables)
      * [2. Start the Docker container in production mode](#2-start-the-docker-container-in-production-mode)
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

## Running Locally

### Option 1: Without Docker

#### 1. Clone the repo

```bash
git clone https://github.com/kontractors/contraman-api.git
cd contraman-api
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Create `.env` file from `.env.example`

Copy the example environment variables file and fill in your configuration:

```bash
cp .env.example .env
```

#### 4. Run the server

```bash
npm run dev
```

### Option 2: With Docker (Development)

#### 1. Create a `.env` file from `.env.example`

```bash
cp .env.example .env
```

Edit the `.env` file with your development settings. Make sure to set the database connection parameters to point to your development database.

#### 2. Start the Docker container

```bash
docker-compose up
```

This will start the application in development mode with hot reloading (using nodemon). The application will automatically restart when you make changes to the source code. Note that the Docker setup does not include a database - you'll need to connect to an external PostgreSQL database as specified in your `.env` file.

## Production Deployment

#### 1. Set up production environment variables

You have two options for setting up environment variables:
- Create a `.env.prod` file based on `.env.example` and fill in your production settings.
- Set environment variables directly when running docker-compose `docker-compose -f docker-compose.prod.yml up -d --build -e VAR_NAME=value`.

#### 2. Start the Docker container in production mode

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This will build and start the application in production mode. Note that the Docker setup does not include a database - you'll need to connect to an external PostgreSQL database as specified in your `.env.prod` file.


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