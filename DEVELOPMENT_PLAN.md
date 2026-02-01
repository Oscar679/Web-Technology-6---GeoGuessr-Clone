# Development Plan: GeoGuessr Clone

## Project Overview

A web application where users can challenge each other in a geography guessing game. Players are shown street-level imagery from Mapillary and must guess the location on a map. Each game session generates a unique shareable link, allowing friends to compete on the same set of locations.

### Tech Stack
- **Backend:** PHP with Slim 4 framework
- **Frontend:** Vanilla ES6 + Web Components + Tailwind CSS
- **APIs:** Mapillary (street imagery), OpenStreetMap via Leaflet (map/guessing)
- **Database:** MySQL
- **Build Tool:** Vite (for Tailwind CSS processing)

---

## Iterative Development Approach

This project follows an agile, iterative development methodology. Each iteration builds upon the previous one, ensuring that the application is always in a working, deployable state. This approach allows for:

- Continuous feedback and adjustment
- Early detection of technical issues
- Demonstrable progress at each stage
- Flexibility to adapt requirements as understanding deepens

---

## Iteration 0: Project Foundation

**Goal:** Establish the project skeleton with a working deployment pipeline.

**Duration:** Initial setup

### Tasks

1. **Backend Setup (Slim 4)**
   - Initialize Composer project with Slim 4
   - Set up directory structure (`public/`, `src/`, `config/`)
   - Create health check endpoint: `GET /api/health`
   - Configure `.env` for environment variables
   - Set up error handling and JSON responses

2. **Frontend Setup**
   - Initialize npm project with Vite
   - Configure Tailwind CSS with Vite plugin
   - Create basic `index.html` with Tailwind styles loading
   - Verify hot reload works in development

3. **Deployment**
   - Deploy backend to melab
   - Verify API endpoint is accessible
   - Configure `.htaccess` for Slim routing (if needed)

### Deliverables
- [] `GET /api/health` returns `{"status": "ok"}`
- [] Frontend loads with Tailwind CSS working
- [] Application is deployed and accessible on melab

### Definition of Done
The application is deployed and a user can visit the URL and see a styled page. The API health endpoint responds correctly.

---

## Iteration 1: Core Game Mechanics

**Goal:** Implement a single-round playable game without persistence.

**Duration:** First development sprint

### Tasks

1. **Mapillary Integration**
   - Create `MapillaryService` class
   - Implement random image fetching from Mapillary API
   - Return image URL and actual coordinates
   - Handle API errors gracefully

2. **API Endpoint**
   - `GET /api/random-location` - returns random street view image and stores actual location server-side (session or temporary storage)

3. **Frontend: Image Display**
   - Create Web Component: `<street-view-image>`
   - Fetch and display Mapillary image
   - Handle loading states

4. **Frontend: Map Component**
   - Create Web Component: `<guess-map>`
   - Integrate Leaflet.js with OpenStreetMap tiles
   - Allow user to click/tap to place a marker
   - Capture guess coordinates

5. **Frontend: Game Flow**
   - Display image → User guesses on map → Submit guess
   - Calculate distance using Haversine formula
   - Display result (distance in km)

### Deliverables
- [ ] Random Mapillary image loads and displays
- [ ] Interactive map allows placing a guess marker
- [ ] Distance calculation works correctly
- [ ] Result is shown after guessing

### Definition of Done
A user can play one complete round: see an image, make a guess, and see how far off they were.

---

## Iteration 2: Game Sessions & Shareable Links

**Goal:** Enable creating game sessions with unique, shareable links.

**Duration:** Second development sprint

### Tasks

1. **Database Schema**
   ```sql
   CREATE TABLE games (
       id VARCHAR(36) PRIMARY KEY,  -- UUID
       locations JSON NOT NULL,      -- Array of Mapillary locations
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **API Endpoints**
   - `POST /api/games` - Create new game, returns game ID
   - `GET /api/games/{id}` - Get game data (locations for that game)

3. **Game Creation Flow**
   - Fetch 5 random Mapillary locations
   - Store in database with unique ID
   - Return shareable URL: `/play/{game_id}`

4. **Frontend: Multi-Round Game**
   - Load game by ID from URL
   - Progress through 5 rounds
   - Track cumulative score
   - Show round-by-round results

5. **Frontend: Share UI**
   - Display shareable link after game creation
   - Copy-to-clipboard functionality

### Deliverables
- [ ] Games persist in database
- [ ] Unique game URLs work
- [ ] Same URL always shows same locations
- [ ] 5-round game flow works

### Definition of Done
A user can create a game, play through 5 rounds, and share the link with a friend who will see the exact same locations.

---

## Iteration 3: Results & Leaderboard

**Goal:** Save player results and display a leaderboard per game.

**Duration:** Third development sprint

### Tasks

1. **Database Schema**
   ```sql
   CREATE TABLE results (
       id INT AUTO_INCREMENT PRIMARY KEY,
       game_id VARCHAR(36) NOT NULL,
       player_name VARCHAR(100) NOT NULL,
       score INT NOT NULL,           -- Total score (lower = better, or points-based)
       played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (game_id) REFERENCES games(id)
   );
   ```

2. **API Endpoints**
   - `POST /api/games/{id}/results` - Submit result (name, score)
   - `GET /api/games/{id}/results` - Get top 10 results for game

3. **Scoring System**
   - Define scoring logic (e.g., 5000 - distance in km, minimum 0)
   - Calculate after each round
   - Sum for total score

4. **Frontend: Name Entry**
   - Prompt for player name before showing results
   - Submit score to API

5. **Frontend: Leaderboard**
   - Create Web Component: `<leader-board>`
   - Display top 10 players for the game
   - Highlight current player's position

6. **Replay Prevention**
   - Store played game IDs in localStorage
   - Check before allowing play
   - Show "already played" message with leaderboard

### Deliverables
- [ ] Results save to database
- [ ] Leaderboard displays top 10
- [ ] Users cannot replay the same game
- [ ] Score calculation is consistent

### Definition of Done
Players can compete on the same game link, results are saved, and a leaderboard shows the top 10 scores. Replay is prevented.

---

## Iteration 4: User Authentication

**Goal:** Add user accounts for persistent identity and history.

**Duration:** Fourth development sprint (required for VG)

### Tasks

1. **Database Schema**
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) UNIQUE NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Add user_id to results table
   ALTER TABLE results ADD COLUMN user_id INT NULL;
   ALTER TABLE results ADD FOREIGN KEY (user_id) REFERENCES users(id);
   ```

2. **API Endpoints**
   - `POST /api/auth/register` - Create account
   - `POST /api/auth/login` - Login, return JWT token
   - `POST /api/auth/logout` - Invalidate token
   - `GET /api/auth/me` - Get current user

3. **Authentication Middleware**
   - JWT token validation
   - Protected routes
   - Optional auth (guest play still allowed)

4. **Frontend: Auth UI**
   - Login form component
   - Registration form component
   - Auth state management
   - Show logged-in user in nav

5. **Link Results to Users**
   - Logged-in users' results linked to account
   - Guest users still use name entry

### Deliverables
- [ ] User registration works
- [ ] Login/logout works
- [ ] JWT tokens secure API routes
- [ ] Results linked to user accounts

### Definition of Done
Users can create accounts, log in, and their game results are associated with their account.

---

## Iteration 5: Personal Statistics & History

**Goal:** Provide users with their gaming history and statistics.

**Duration:** Fifth development sprint

### Tasks

1. **API Endpoints**
   - `GET /api/users/me/stats` - Aggregated statistics
   - `GET /api/users/me/games` - List of played games with scores

2. **Statistics to Track**
   - Total games played
   - Average score
   - Best score
   - Total distance guessed

3. **Frontend: Profile Page**
   - Create profile/stats page
   - Display statistics
   - List recent games with scores
   - Link to replay leaderboards

### Deliverables
- [ ] Users can view their statistics
- [ ] Game history is displayed
- [ ] Statistics calculate correctly

### Definition of Done
Logged-in users have a profile page showing their gaming statistics and history.

---

## Iteration 6: Polish & Responsive Design

**Goal:** Ensure the application works well on all devices and is visually polished.

**Duration:** Final sprint (required for VG)

### Tasks

1. **Responsive Design**
   - Test on mobile, tablet, desktop
   - Adjust layouts for small screens
   - Ensure map is usable on touch devices
   - Test pinch-to-zoom on mobile

2. **UI/UX Improvements**
   - Loading states and skeletons
   - Error messages and handling
   - Smooth transitions
   - Consistent styling

3. **Accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

4. **Performance**
   - Optimize image loading
   - Minimize bundle size
   - Cache API responses where appropriate

### Deliverables
- [ ] Works on mobile devices
- [ ] No layout breaks on any screen size
- [ ] Loading states for all async operations
- [ ] Professional, polished appearance

### Definition of Done
The application provides a good user experience on both desktop and mobile devices.

---

## Summary: Requirements Mapping

| Requirement | Iteration |
|-------------|-----------|
| Create new game session | 2 |
| Data from external API | 1 |
| Share unique link | 2 |
| Play game session | 1, 2 |
| Save results to database | 3 |
| Top 10 leaderboard | 3 |
| One play per game per user | 3 |
| **Authentication (VG)** | 4 |
| **Personal statistics (Extra)** | 5 |
| **Responsive design (VG)** | 6 |

---

## Git Workflow

Each iteration should result in multiple commits with clear messages:

```
feat: add Mapillary service for fetching random images
feat: implement guess-map web component with Leaflet
fix: correct distance calculation for edge cases
docs: update README with setup instructions
```

Branches (optional):
- `main` - stable, deployable code
- `feature/iteration-X-name` - development branches

---

## Notes for Examiner

This document outlines the planned iterative development approach for this project. Each iteration:

1. Has a clear, achievable goal
2. Results in working, deployable software
3. Builds upon previous iterations
4. Can be demonstrated and tested independently

Progress can be tracked through:
- Git commit history
- Deployed versions on melab
- This document's checkbox completion status

The approach ensures "always working software" as required, while incrementally adding functionality toward the complete application.
