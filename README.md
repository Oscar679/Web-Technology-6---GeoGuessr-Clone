# GeoGuessr 1ME326 - Fullstackprojekt

Detta repo innehaller en fullstack-webbapplikation dar anvandare utmanar varandra i ett geolokaliseringsspel baserat pa gatubilder.

## Projektstruktur

- `geoGuessr_frontend/` - klient (Web Components + Vite + Tailwind)
- `geoGuessr_backend/` - API (PHP + Slim 4 + PDO + JWT)
- `DEVELOPMENT_PLAN.md` - iterativ plan och processunderlag
- `PROJECT_DOCUMENTATION.md` - slutlig dokumentation for examination

## Kort funktionell oversikt

- Starta ny spelomgang (5 rundor)
- Dela unik lank till exakt samma spelomgang
- Spara resultat i databas
- Visa matchresultat efter avslutad omgang
- Forhindra att samma anvandare spelar samma omgang flera ganger
- Inloggning/registrering med JWT
- Matchhistorik och global leaderboard

## Tekniskt

- Backend: PHP, Slim 4, PDO, MySQL, php-jwt
- Frontend: Vanilla ES-moduler, Web Components, Tailwind CSS, Vite
- Externa API: Mapillary (bilder), OpenStreetMap/Leaflet (karta)

## Lokal korning

### Frontend

```bash
cd geoGuessr_frontend
npm install
npm run dev
```

Bygg for produktion:

```bash
npm run build
```

### Backend

1. Konfigurera `.env` i `geoGuessr_backend/` (DB, JWT, Mapillary).
2. Se till att `vendor/` finns (Composer dependencies installerade).
3. Rikta webbserverns document root mot `geoGuessr_backend/public`.

## Miljovariabler (frontend)

- `VITE_API_BASE_URL` - bas-URL till backend API
- `VITE_APP_BASE_PATH` - bas-path for deployad frontend

## API-endpoints (sammanfattning)

Publika:

- `GET /api/health`
- `POST /api/login`
- `POST /api/register`
- `GET /api/leaderboard`

Skyddade (Bearer JWT):

- `PUT /api/startgame`
- `GET /api/games/{gameId}`
- `POST /api/games/{gameId}/result`
- `GET /api/games/{gameId}/results`
- `GET /api/users/me/games`

## Deployment (melab)

1. Bygg frontend (`npm run build`).
2. Publicera frontendfiler till melab-path for klienten.
3. Publicera backend med fungerande `.htaccess` och `public/index.php`.
4. Verifiera:
   - inloggning
   - start av spel
   - delningslank
   - resultatsparning
   - matchhistorik

## Testchecklista innan inlamning

- Ny anvandare kan registrera sig och logga in
- Spel kan startas och 5 rundor kan spelas
- Delad lank oppnas av annan anvandare och ger samma spel
- Resultat sparas och visas
- Samma anvandare kan inte spela samma gameId igen
- Matchhistorik fungerar
- UI fungerar pa desktop och mobil
