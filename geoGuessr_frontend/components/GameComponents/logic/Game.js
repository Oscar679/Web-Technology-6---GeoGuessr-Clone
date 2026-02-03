import Geolocation from "../logic/Geolocation"

// Singleton implementation
class Game {
    static instance;
    constructor(coordinates) {
        if (Game.instance) {
            return Game.instance;
        }

        Game.instance = this;

        this.players = [];
        this.round = 0;
        this.locations = coordinates;
    }

    submitGuess(guessedCoordinates) {
        if (this.round < 5) {
            const distance = Geolocation.haversine(this.locations[this.round], guessedCoordinates);
            console.log(`The distance between your guess and actual location is: ${distance} kilometers`);
            this.updateRound();
        } else {
            console.error(`Maximum amount of rounds have been met: ${this.round}`);
            return;
        }
    }

    updateRound() {
        this.round += 1;
    }
}

export default Game;