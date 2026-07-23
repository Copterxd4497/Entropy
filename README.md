# Entropy 2.0 — what you need to run this project
### Check it out https://entropy-ashen.vercel.app/

# This is a Node.js app (React + Vite frontend, Express + MongoDB backend).
# Dependencies are installed with npm, not pip.

## System requirements

- Node.js 20+ (includes npm)
- MongoDB (local or Atlas) — used by the server

## Install dependencies

From the project root:

  cd client && npm install
  cd ../server && npm install

## Run the app

Terminal 1 — frontend (http://localhost:5173):

  cd client && npm run dev

Terminal 2 — backend (when server.js is implemented):

  cd server && node server.js

## Packages (installed automatically by npm)

Client (client/package.json):
  react, react-dom
  vite, eslint, and other dev tooling

Server (server/package.json):
  express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken
You've reached your free plan limit.
Free responses reset in 1 day. Plan upgrades are temporarily unavailable. Read more.  
