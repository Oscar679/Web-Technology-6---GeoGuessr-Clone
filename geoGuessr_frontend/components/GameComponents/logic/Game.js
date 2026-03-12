import Geolocation from "../logic/Geolocation";
import GameService from "../../../api/GameService";

/**
 * In-memory game state singleton used across game UI components.
 */
class Game {
    static instance;

    constructor(coordinates) {
        this.round = 0;
        this.locations = coordinates;
        this.gameId = null; // Set after game is created/fetched from backend.
        this.score = 0;

        this.gameService = new GameService();
    }

    /**
     * Returns the singleton game instance.
     * Coordinates are required only on the first initialization.
     */
    static getInstance(coordinates) {
        if (!Game.instance) {
            if (!coordinates) {
                throw new Error("Game must be instantiated with coordinates");
            }
            Game.instance = new Game(coordinates);
        }

        return Game.instance;
    }

    /**
     * Applies one guess to the current round and updates score/progress.
     */
    submitGuess(guessedCoordinates) {
        if (this.round < 5) {
            const actualCoords = this.locations[this.round];
            const distance = Geolocation.haversine(actualCoords, guessedCoordinates);
            // Lower score is better; each round adds distance error in kilometers.
            this.score += distance;

            const livePointsElement = document.querySelector("live-points");
            if (livePointsElement) {
                livePointsElement.updatePoints(this.score);
            }

            document.dispatchEvent(new CustomEvent("guess-result", {
                detail: { guessCoords: guessedCoordinates, actualCoords, distance, isLastRound: this.round === 4 }
            }));

            this.updateRound();
        } else {
            console.error(`Maximum amount of rounds played: ${this.round}`);
        }
    }

    /**
     * Advances the round counter and emits a UI progress event.
     */
    updateRound() {
        this.round += 1;

        document.dispatchEvent(new CustomEvent("game-round-changed", {
            detail: {
                currentRound: Math.min(this.round + 1, 5),
                totalRounds: 5
            }
        }));

        if (this.round === 5) {
            this.completeGame();
        }
    }

    /** Stores backend game id so score submission can target the correct game. */
    setGameId(gameId) {
        this.gameId = gameId;
    }

    /**
     * Persists final score and emits game-complete with the result URL.
     * Navigation is deferred to the UI so the user can view the last result first.
     */
    completeGame() {
        this.gameService.saveResult(Game.instance)
            .then(() => {
                const url = new URL("GameComplete.html", window.location.href);
                if (this.gameId) {
                    url.searchParams.set("gameId", this.gameId);
                }
                document.dispatchEvent(new CustomEvent("game-complete", {
                    detail: { url: url.toString() }
                }));
            })
            .catch(error => {
                console.error("Error completing game:", error);
                const message = error?.message || "Could not save your result.";
                document.dispatchEvent(new CustomEvent("game-error", {
                    detail: { message }
                }));
            });
    }
}

export default Game;
