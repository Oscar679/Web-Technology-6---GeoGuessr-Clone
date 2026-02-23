# Project Documentation — GeoGuessr 1ME326

---

## 1. Architecture

The application is a fullstack web application split into a PHP backend and a JavaScript frontend, communicating over a RESTful JSON API.

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│                                                     │
│   ┌─────────────┐        ┌──────────────────────┐  │
│   │ Web          │        │ Leaflet / OSM        │  │
│   │ Components   │        │ (interactive map)    │  │
│   │ (Vite build) │        └──────────────────────┘  │
└───┴──────┬───────┴─────────────────────────────────-┘
           │ fetch (JSON, Bearer JWT)
           ▼
┌─────────────────────────────────────────────────────┐
│              PHP Backend (Slim 4)                   │
│                                                     │
│  AuthService   GameService   MapillaryService       │
│      │              │               │               │
└──────┼──────────────┼───────────────┼───────────────┘
       │              │               │
       ▼              ▼               ▼
  ┌─────────┐   ┌──────────┐   ┌──────────────┐
  │  MySQL  │   │  MySQL   │   │  Mapillary   │
  │  users  │   │  games / │   │  API         │
  │  stats  │   │  results │   │  (external)  │
  └─────────┘   └──────────┘   └──────────────┘
```

### Data flow — starting a game

1. The logged-in user clicks "New Game". The frontend sends `POST /api/startgame` with a Bearer JWT.
2. The backend verifies the token, then calls the Mapillary API via `MapillaryService` to fetch 5 random street-level images from seeded European city bounding boxes.
3. The 5 image objects (URL, lat, lng) are stored as a JSON column in the `games` table with a randomly generated hex ID.
4. The game ID and image data are returned to the frontend.
5. The frontend renders each round: the user sees a street image and places a pin on an interactive Leaflet/OpenStreetMap map.
6. After all 5 rounds, the total score (sum of distances in km, lower is better) is submitted via `POST /api/games/{id}/result`.
7. The backend saves the result, enforces 1v1 rules (max 2 unique players), updates `player_stats` with an Elo-like rating change, and the frontend navigates to the results page.
8. The results page fetches the top 10 results for that game via `GET /api/games/{id}/results` and renders the leaderboard.

The shareable link is just the game page URL with the game ID as a query parameter. Any logged-in user who opens it will load the same game from the database and play the same 5 locations.

---

## 2. Technology Choices

**PHP + Slim 4 (backend)**
I chose Slim 4 over a full framework like Laravel because the application only needs routing, middleware, and HTTP abstraction — no templating, no ORM, no queues. Slim is PSR-7 compliant and has a minimal footprint, which makes it easy to reason about what the framework is doing and what I am doing. Laravel would have been faster to scaffold but harder to understand at this level.

**Web Components (frontend)**
The assignment required a framework or API for UI — I chose native Web Components (custom elements) over React or Vue. The main reason was that Web Components run in the browser with no runtime dependency. Each component is a self-contained class that encapsulates its own HTML, event listeners, and state. The downside is that there is no virtual DOM or reactive state system, so state management is more manual, but for a game of this scope it was manageable.

**Vite (build tool)**
Vite handles the multi-page build (7 separate HTML entry points), processes Tailwind CSS, and provides a dev server with a proxy to the backend. It produces hashed, minified asset bundles in `dist/` which are what gets deployed to melab. Webpack would have worked too but Vite's configuration is simpler and the build times are noticeably faster.

**JWT (authentication)**
I chose stateless JWT over PHP sessions because the frontend and backend are on different paths on melab and session cookies would have required careful same-site/domain configuration. With JWT the client stores the token in `localStorage` and sends it as a Bearer header on every protected request. The token expires after 24 hours and is signed with a secret key via `firebase/php-jwt`.

**Mapillary (street imagery)**
Google Street View's API is paid beyond a low free tier. Mapillary is free and has global coverage. The integration works by querying images within bounding boxes around 20 seeded European cities and returning a random result each time. The image URL and real coordinates are what get stored — the coordinates are never exposed to the frontend until the round ends, which prevents cheating.

**Leaflet + OpenStreetMap (map)**
Free, open-source, well-documented, and works well on touch devices. No API key required. Leaflet handles the interactive pin placement for guesses. The distance between the guess and the real location is calculated using the Haversine formula in `Geolocation.js`.

**Rating system**
Beyond the basic per-game leaderboard, I added a persistent `player_stats` table with a simple Elo-inspired rating: +20 for a win, −15 for a loss, +10 for a tie, floored at 0. This feeds the global leaderboard and gives returning players a sense of long-term progression.

**PHP-DI (dependency injection)**
Services are instantiated through a PHP-DI container defined in `config/dependencies.php`. This keeps the route handlers clean and makes it straightforward to swap out or extend a service without touching the routes.

---

## 3. AI Usage

I used **Claude Code** (Anthropic's CLI-based coding assistant, powered by Claude Sonnet) throughout the project, from the initial scaffold through to the final cleanup pass.

**How I used it:**
- Scaffolding the initial Slim 4 project structure, middleware wiring, and `.htaccess` configuration for melab deployment
- Writing the `MapillaryService` — the Guzzle HTTP calls, bbox construction, and parsing the graph API response
- Generating Tailwind CSS layouts for the game page, login, and leaderboard — these were mostly first-draft quality and needed spacing/colour adjustments
- Debugging JWT middleware — the initial token extraction had an off-by-one on the `Bearer ` split that the tool helped identify
- Implementing the Haversine formula and wiring it into the scoring logic
- Several cleanup and refactoring passes, such as removing dead code, fixing an accessibility bug (`for="email"` on a label pointing to `id="username"`), and inlining unnecessary abstractions

**What needed correction:**
The AI frequently over-engineered things. Early versions of `GameService.php` had an abstraction layer for "round state" that was never needed because the game state lives in the database, not in memory. I removed it and simplified to direct PDO queries. Similarly, the frontend initially had a separate `LivePoints` class whose only method was `Math.round()` — this was generated as boilerplate and I later removed it as unnecessary indirection.

The tool was also occasionally inconsistent about whether code belonged in a service or directly in the route handler. I had to make deliberate decisions about where logic lived and sometimes override what was generated.

**Example prompts:**
- *"Write a PHP service class that calls the Mapillary graph API to fetch a random street-level image from within a given lat/lng bounding box using Guzzle"*
- *"Build a Web Component called game-container that manages 5 rounds of a guessing game, fires a custom event when all rounds are complete, and exposes a method to register a guess"*

Overall the tool made me significantly faster on boilerplate and infrastructure, but I needed to read and understand every generated file to catch over-engineering and integration mismatches.

---

## 4. Reflections

**What went well:**
The iterative approach paid off. Because I kept the application deployable at every stage, I never had a situation where things worked locally but broke entirely on melab. The architecture — services on the backend, components on the frontend — stayed coherent as features were added. The 1v1 sharing mechanic came together cleanly: one game ID, two players, same 5 locations.

**Challenges:**
The Mapillary API was the trickiest part. The bounding boxes for some cities returned no results depending on Mapillary's coverage, so I had to tune the seeded locations and add a fallback city list. The 1v1 enforcement (max 2 players, no replays, rating updates that only trigger on the second player's submission) required careful ordering of DB writes to avoid race conditions under concurrent submissions.

**What I would do differently:**
I would write the database schema as a `schema.sql` file from the start rather than building it up through ad hoc queries. It would have made the data model easier to reason about and document. I would also have set up ESLint stricter from the beginning — catching issues like the mismatched `for`/`id` earlier would have been easier with a linting rule.

**AI's impact on workflow:**
Using Claude Code meant I could attempt a more complete application than I would have managed otherwise — authentication, external API integration, an Elo rating system, and responsive design would have been hard to fit into the timeline without AI assistance. The shift was less about writing less code and more about spending time on decisions: what to keep, what to simplify, whether the generated structure made sense. That felt like a more useful kind of problem to be solving.
