# Fullstackprojekt 1ME326 - GeoGuessr-inspirerat utmaningsspel

## Projektoversikt

Detta projekt ar en fullstack-webbapplikation dar anvandare kan utmana varandra i ett geografiskt gissningsspel. En spelare startar en spelomgang, spelar fem rundor och far darefter en unik lank till exakt samma omgang. Lanken kan delas med en van som da spelar med samma bilder och samma forutsattningar. Nar bada spelarna har genomfort omgangen visas en resultatlista dar resultaten kan jamforas.

Spelet bygger pa gatubilder fran ett externt API och kartinteraktion i webblasaren. Resultatet beraknas som summan av avstandet mellan spelarens gissning och den verkliga platsen. Lagre poang ar battre.

Projektet uppfyller grundkraven i uppgiften:

- anvandaren kan skapa en ny spelomgang
- speldata hamtas fran ett externt API
- varje spelomgang far en unik delbar lank
- resultat sparas i databasen
- en anvandare kan bara spela samma spelomgang en gang
- resultatlista visas efter avslutad spelomgang

Projektet uppfyller ocksa flera extrakrav:

- autentisering och inloggning
- personlig historik
- responsiv design for desktop och mobil
- global leaderboard med rating

## Arkitekturbeskrivning

Applikationen ar uppdelad i tva huvuddelar: ett frontend-projekt i JavaScript och ett backend-projekt i PHP. Frontend kors i webblasaren och ansvarar for presentation, anvandarinteraktion och kommunikation med API:t. Backend ansvarar for autentisering, spelgenerering, lagring av resultat och hamtning av statistik.

### Overgripande struktur

```text
Browser
  |
  | HTTP/JSON + Bearer token
  v
Frontend (Web Components + Vite + Tailwind)
  |
  v
REST API (PHP + Slim 4)
  |
  +--> MySQL / MariaDB
  |
  +--> Mapillary API
```

### Dataflode

Ett typiskt flode nar en anvandare startar en spelomgang ser ut sa har:

1. Anvandaren loggar in eller registrerar ett konto.
2. Frontend skickar en forfragan till `POST /api/startgame`.
3. Backend verifierar JWT-token och anropar `MapillaryService`.
4. `MapillaryService` hamtar fem slumpmassiga gatubilder fran Mapillary inom utvalda geografiska omraden.
5. Backend sparar spelomgangen i databasen med ett unikt `gameId` och lagrar bilddata och koordinater.
6. Frontend far tillbaka `gameId` och bilddata och renderar spelet.
7. For varje runda placerar anvandaren en markor pa kartan.
8. Frontend raknar ut avstandet med Haversine-formeln och summerar spelarens totalpoang.
9. Nar alla rundor ar klara skickas resultatet till `POST /api/games/{gameId}/result`.
10. Backend sparar resultatet, kontrollerar att anvandaren inte redan spelat samma omgang och uppdaterar spelarstatistik.
11. Resultatsidan hamtar topplistan via `GET /api/games/{gameId}/results`.

### Komponenter och ansvar

Frontend ar uppdelad i ateranvandbara Web Components. Exempel:

- `game-container`: styr spelvyn och rundflodet
- `street-view-image`: laddar och visar spelbilderna
- `open-street-map`: hanterar kartan och spelarens gissningar
- `game-winner`: visar resultat for en spelomgang
- `leader-board`: visar global leaderboard
- `match-history`: visar spelarens historik

Backend ar uppdelad i tjanster:

- `AuthService`: skapar och verifierar JWT-token
- `UserService`: hanterar anvandare och losenord
- `GameService`: skapar spel, sparar resultat och hamtar historik/leaderboard
- `MapillaryService`: integrerar mot det externa bild-API:t

### Databasmodell

Datamodellen bygger i huvudsak pa tre typer av information:

- anvandare
- spelomgangar
- spelresultat/statistik

Forenklat innehaller databasen tabeller for:

- `users`: anvandarkonton
- `games`: spelomgangar med genererad platsdata
- `game_results`: en rad per spelares genomforda forsok
- `player_stats`: aggregerad statistik som vinster, matcher och rating

Relationerna ar relativt raka: en anvandare kan ha manga resultat, en spelomgang kan ha upp till tva resultat, och statistik sammanstalls per anvandare.

## Teknikval och motiveringar

### Backend: PHP med Slim 4

Jag valde PHP med Slim 4 som backend-ramverk. Kravet i uppgiften var att anvanda PHP med ett befintligt ramverk, och Slim passade bra eftersom projektet framst behovde routing, middleware och JSON-svar. Alternativet hade varit ett storre ramverk som Laravel, men det hade gett mer inbyggd funktionalitet an projektet faktiskt behovde. For ett mindre spel-API var Slim enklare att forsta och lattare att halla strukturerat.

### Frontend: Web Components

I frontend valde jag Web Components i stallet for React eller Vue. Anledningen var att uppgiften kravde nagon form av UI-ramverk eller API, men inte nodvandigtvis ett tungt frontendbibliotek. Web Components gav en tydlig komponentindelning utan extra runtime-beroenden. Nackdelen ar att state-hanteringen blir mer manuell an i React, men i den har applikationens storlek fungerade det bra.

### Byggkedja: Vite och Tailwind

Frontend paketeras med Vite. Det ger snabb utvecklingsserver, enkel multipage-konfiguration och minifierad produktionbuild. Tailwind anvandes for att bygga ett konsekvent och responsivt grannssnitt snabbt. Ett alternativ hade varit vanlig CSS eller Bootstrap, men Tailwind gav battre kontroll over layout och komponentstil utan att lasa designen till ett fardigt system.

### Databasatkomst: PDO

Pa backend anvands PDO direkt i stallet for ett ORM. Jag valde detta for att datamodellen ar liten och fragorna ar relativt enkla. Ett ORM hade kunnat minska mangden SQL i vissa delar, men hade ocksa okat abstraktionsnivan. Med PDO blev det tydligt exakt vad som sparas och hamtas.

### Autentisering: JWT

For autentisering anvands JWT i stallet for PHP-sessioner. Eftersom frontend och backend ar frikopplade och kommunicerar via REST passade stateless autentisering battre. Frontend skickar en Bearer-token till skyddade endpoints. En nackdel ar att token lagras i `localStorage`, vilket kraver att resten av klientkoden ar forsiktig med XSS-risker. For ett kursprojekt var detta en rimlig kompromiss, men i en storre applikation hade jag overvagt en sakrare cookie-baserad losning.

### Externa tjanster: Mapillary och OpenStreetMap

For spelinnehallet anvands Mapillary. Det uppfyller kravet pa externt API och gor att spelet kan generera manga omgangar utan att innehallet tar slut. For kartan anvands Leaflet med OpenStreetMap. Det var ett naturligt val eftersom det ar gratis, val dokumenterat och fungerar bra i webblasaren utan egen API-nyckel.

### Resultatmodell och rating

Utöver den lokala resultatlistan for varje omgang lade jag till global statistik och en enkel ratingmodell. Den ar inte en full Elo-implementation, men fungerar som langsiktig progression. Alternativet hade varit att bara spara raa matchresultat, men rating och historik gor applikationen mer spelbar over tid och uppfyller extrakraven battre.

### Felhantering och underhallbarhet

Under projektet blev det tydligt att ateranvandbar felhantering var viktig. Darfor samlades frontendens fetch-logik i en gemensam tjanst for att minska duplicerad kod och fa konsekventa felmeddelanden. Pa backend separerades logik i serviceklasser i stallet for att lagga allt direkt i route handlers. Det gor projektet lattare att felsoka och vidareutveckla.

## AI-anvandning

Jag anvande generativa AI-verktyg aktivt i projektet, framst som stod for implementation, felsokning och refaktorering. Verktygen anvandes inte som ersattning for forstaelse, utan som ett satt att snabbare komma fram till losningar som sedan behovde granskas och anpassas.

### Verktyg

- ChatGPT / Codex for kodforslag, refaktorering och felsokning
- eventuella andra kodassistenter under utvecklingsarbetet vid behov

### Vad AI anvandes till

- generera forsta versioner av UI-komponenter
- hjalpa till att strukturera Slim-backend och tjansteklasser
- foresla integration mot Mapillary API
- hjalpa till med JWT-autentisering
- hitta och ratta buggar i resultatfloden och formular
- stada upp redundant kod och centralisera API-anrop

### Anpassningar och korrigeringar

AI-genererad kod behovde nastan alltid justeras. Exempel:

- vissa komponenter inneholl onodig boilerplate
- felhantering var ibland for svag eller inkonsekvent
- UI-texter och tillstand var ibland logiskt felaktiga
- vissa losningar blev mer komplexa an nodvandigt och behovde forenklas

Ett konkret exempel var resultatsidan dar en spelare som redan spelat fortfarande kunde visas som `waiting`. Dar behovde logiken andras manuellt sa att faktisk poang visades nar ett resultat redan fanns sparat.

### Reflektion kring AI

Det som fungerade bast var att anvanda AI for avgransade delproblem, till exempel "skriv en service som hamtar data fran ett API" eller "hjalp mig hitta varfor det har UI-tillstandet blir fel". Det som fungerade samre var nar AI fick for oppna uppgifter, eftersom svaret da ofta blev mer generiskt eller overbyggt an projektet behovde.

## Reflektioner och lardomar

Det som gick bast i projektet var den iterativa utvecklingen. Genom att halla projektet korbart under hela processen blev det enklare att testa nya delar utan att allt annat foll sonder. Kombinationen av en liten backendstruktur och komponentbaserad frontend gjorde ocksa att det gick att lagga till funktioner stegvis.

Den storsta tekniska utmaningen var integrationen mot externa data. Mapillary gav inte alltid jamnt resultat beroende pa omrade, sa spelinnehallet behovde genereras fran utvalda geografiska platser dar tackningen var battre. En annan utmaning var att halla spelreglerna konsekventa, sarskilt att samma anvandare inte ska kunna spela samma lank flera ganger och att en match bara ska acceptera tva spelare.

Om jag skulle gora om projektet hade jag lagt mer tid tidigt pa dokumenterad databasdesign och teststrategi. Jag hade ocksa infort striktare kvalitetskontroller tidigare, till exempel linting och tydligare gemensamma hjalpfunktioner i frontend, eftersom flera buggar i efterhand visade sig bero pa duplicerad logik.

AI paverkade arbetssattet tydligt. Jag kunde arbeta snabbare och ta mig an fler delar av applikationen, men det flyttade ocksa fokus fran att skriva varje rad sjalv till att granska, forsta och forbattra kodforslag. Det gjorde kvalitetsgranskning viktigare an i mindre projekt utan AI.

## Korning lokalt

### Frontend

```bash
cd geoGuessr_frontend
npm install
npm run dev
```

Produktionbuild:

```bash
npm run build
```

### Backend

1. Konfigurera `geoGuessr_backend/.env`
2. Sakerstall att Composer-beroenden finns installerade
3. Peka webbserverns document root mot `geoGuessr_backend/public`

## API-oversikt

Publika endpoints:

- `POST /api/login`
- `POST /api/register`
- `GET /api/leaderboard`

Skyddade endpoints:

- `POST /api/startgame`
- `GET /api/games/{gameId}`
- `POST /api/games/{gameId}/result`
- `GET /api/games/{gameId}/results`
- `GET /api/users/me/games`

## Bilagor i repo

- `DEVELOPMENT_PLAN.md` - stod for agil process och iterationer
- `DOCUMENTATION.md` - tidigare dokumentationsutkast
- `schema.sql` - databasstruktur
