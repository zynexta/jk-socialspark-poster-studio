# JK Smart Poster Generator

A full-stack web application for creating, customizing, and downloading smart promotional posters.

## Project Structure

```
jk-smart-poster-generator/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind CSS)
│   ├── src/                    # Components, pages, context, and styles
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite config & API proxy settings
│   └── package.json            # Frontend dependencies & scripts
├── server/                     # Backend API Server (Node.js + Express + MongoDB)
│   ├── server.js               # REST API endpoints & Mongoose schemas
│   └── package.json            # Backend dependencies & scripts
├── package.json                # Root package orchestrating client & server
└── README.md                   # Project documentation
```

## Quick Start

### 1. Install Dependencies

To install dependencies for both `client` and `server`:
```bash
npm run install:all
```

Or install them individually:
```bash
# Frontend
cd client
npm install

# Backend
cd server
npm install
```

### 2. Run Development Servers

**Option A: Run both Client and Server concurrently from the root directory**
```bash
npm run dev
```

**Option B: Run Client or Server individually**

- **Frontend only** (Port 3000):
  ```bash
  npm run dev:client
  ```
- **Backend server only** (Port 5000):
  ```bash
  npm run dev:server
  ```

## API Endpoint Proxy

The frontend Vite server (Port 3000) automatically proxies requests to `/api/*` to the backend Express server running on `http://localhost:5000`.
