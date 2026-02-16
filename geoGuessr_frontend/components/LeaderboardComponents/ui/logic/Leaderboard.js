import GameService from "../../../../api/GameService";

/**
 * Provides leaderboard data for ranking UI components.
 */
class Leaderboard {
    static instance;

    constructor() {
        Leaderboard.instance = this;
        this.gameService = new GameService();
    }

    /** Singleton getter used by leaderboard page component. */
    static getInstance() {
        if (!Leaderboard.instance) {
            Leaderboard.instance = new Leaderboard();
        }

        return Leaderboard.instance;
    }

    /** Loads global leaderboard rows from backend API. */
    async fetchResults() {
        const data = await this.gameService.getGlobalLeaderboard();
        return Array.isArray(data.results) ? data.results : [];
    }
}

export default Leaderboard;
