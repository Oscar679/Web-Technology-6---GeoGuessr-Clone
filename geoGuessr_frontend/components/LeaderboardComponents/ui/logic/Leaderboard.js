import GameService from "../../../../api/GameService";

class Leaderboard {
    static instance;

    constructor() {
        Leaderboard.instance = this;
        this.gameService = new GameService();
    }

    static getInstance() {
        if (!Leaderboard.instance) {
            Leaderboard.instance = new Leaderboard();
        }

        return Leaderboard.instance;
    }

    async fetchResults() {
        const data = await this.gameService.getGlobalLeaderboard();
        return Array.isArray(data.results) ? data.results : [];
    }
}

export default Leaderboard;
