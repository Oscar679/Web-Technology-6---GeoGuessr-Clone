/**
 * @file components/GameComponents/logic/Game.js
 * @description Game module.
 */
import Geolocation from "../logic/Geolocation"
import GameService from "../../../api/GameService";

// Singleton implementation
/**
 * Represents the Game module and encapsulates its behavior.
 */
class Game {
    static instance;
    /**
     * Initializes instance state and service dependencies.
     * @param {*} coordinates
     */
    constructor(coordinates) {
        this.round = 0;
        this.locations = coordinates;
        this.gameId = null; // backend sets this value
        this.score = 0;

        this.gameService = new GameService();
    }

    /**
     * Returns the singleton instance for this class.
     * @param {*} coordinates
     * @returns {*}
     */
    static getInstance(coordinates) {
        if (!Game.instance) {
            if (!coordinates) {
                throw new Error("Game must be instatiated with coordinates");
            }
            Game.instance = new Game(coordinates);
        }

        return Game.instance;
    }

    /**
     * Submits user input or game data to the backend.
     * @param {*} guessedCoordinates
     * @returns {void}
     */
    submitGuess(guessedCoordinates) {
        if (this.round < 5) {
            const distance = Geolocation.haversine(this.locations[this.round], guessedCoordinates);
            this.score += distance; // for now score is just the distance, but we can make it more complex later on
            const livePointsElement = document.querySelector('live-points');
            if (livePointsElement) {
                livePointsElement.updatePoints(this.score); // update visible live points UI
            }
            this.updateRound();
        } else {
            console.error(`Maximum amount of rounds played: ${this.round}`);
            return;
        }
    }

    /**
     * Updates component or game state after an interaction.
     * @returns {void}
     */
    updateRound() {
        this.round += 1;
        if (this.round == 5) {
            this.completeGame();
            return;
        }
    }

    /**
     * Sets internal state used by this component.
     * @param {*} gameId
     * @returns {void}
     */
    setGameId(gameId) {
        this.gameId = gameId;
    }

    /**
     * Executes the completeGame workflow for this module.
     * @returns {void}
     */
    completeGame() {
        this.gameService.saveResult(Game.instance)
            .then(() => {
                const url = new URL("GameComplete.html", window.location.href);
                if (this.gameId) {
                    url.searchParams.set("gameId", this.gameId);
                }
                window.location.href = url.toString();
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

