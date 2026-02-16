# GeoGuessr 1ME326 - Fullstack Project

This repository contains a fullstack web application where users challenge each other in a geolocation game based on street-level images.

## Project Structure

- `geoGuessr_frontend/` - client (Web Components + Vite + Tailwind)
- `geoGuessr_backend/` - API (PHP + Slim 4 + PDO + JWT)
- `DEVELOPMENT_PLAN.md` - iterative planning and process evidence

## Functional Overview

- Start a new game session (5 rounds)
- Share a unique link to the exact same game session
- Save results in the database
- Show match results after completion
- Prevent the same user from playing the same session more than once
- Login/registration with JWT
- Match history and global leaderboard

## Tech Stack

- Backend: PHP, Slim 4, PDO, MySQL, php-jwt
- Frontend: Vanilla ES modules, Web Components, Tailwind CSS, Vite
- External APIs: Mapillary (images), OpenStreetMap/Leaflet (map)

## Local Run

### Frontend

```bash
cd geoGuessr_frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

### Backend

1. Configure `.env` in `geoGuessr_backend/` (DB, JWT, Mapillary).
2. Ensure `vendor/` exists (Composer dependencies installed).
3. Point web server document root to `geoGuessr_backend/public`.

## Environment Variables (frontend)

- `VITE_API_BASE_URL` - base URL for backend API
- `VITE_APP_BASE_PATH` - base path for deployed frontend

## API Endpoints (Summary)

Public:

- `GET /api/health`
- `POST /api/login`
- `POST /api/register`
- `GET /api/leaderboard`

Protected (Bearer JWT):

- `PUT /api/startgame`
- `GET /api/games/{gameId}`
- `POST /api/games/{gameId}/result`
- `GET /api/games/{gameId}/results`
- `GET /api/users/me/games`

## Deployment (melab)

1. Build frontend (`npm run build`).
2. Publish frontend files to your melab client path.
3. Publish backend with working `.htaccess` and `public/index.php`.
4. Verify:
   - login
   - game start
   - share link flow
   - result saving
   - match history

## Pre-Submission Test Checklist

- A new user can register and log in
- A game can start and all 5 rounds can be completed
- Shared link opens for another user and loads the same game
- Results are saved and shown
- Same user cannot replay the same `gameId`
- Match history works
- UI works on desktop and mobile
