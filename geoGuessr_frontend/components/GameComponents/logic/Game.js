import Geolocation from "../logic/Geolocation"
import GameService from "../../../api/GameService";

// Singleton implementation
class Game {
    static instance;
    constructor(coordinates) {
        this.players = [];
        this.round = 0;
        this.locations = coordinates;
        this.gameId = null; // backend sets this value
        this.score = 0;

        this.gameService = new GameService();
    }

    static getInstance(coordinates) {
        if (!Game.instance) {
            if (!coordinates) {
                throw new Error("Game must be instatiated with coordinates");
            }
            Game.instance = new Game(coordinates);
        }

        return Game.instance;
    }

    submitGuess(guessedCoordinates) {
        if (this.round < 5) {
            const distance = Geolocation.haversine(this.locations[this.round], guessedCoordinates);
            console.log(`The distance between your guess and actual location is: ${distance} kilometers`);
            alert(distance);
            this.updateRound();
            this.score += distance; // for now score is just the distance, but we can make it more complex later on
            const livePointsElement = document.querySelector('live-points');
            if (livePointsElement) {
                livePointsElement.updatePoints(this.score); // update visible live points UI
            }
        } else {
            console.error(`Maximum amount of rounds played: ${this.round}`);
            return;
        }
    }

    updateRound() {
        this.round += 1;
        if (this.round == 5) {
            this.completeGame();
            return;
        }
    }

    setGameId(gameId) {
        this.gameId = gameId;
    }

    completeGame() {
        Promise.resolve(this.gameService.saveResult(Game.instance))
            .then(() => {
                window.location.href = "test.html";
            })
            .catch(error => {
                console.error("Error completing game:", error);
            });
    }
}

export default Game;
