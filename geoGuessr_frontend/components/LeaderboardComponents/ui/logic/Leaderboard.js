/**
 * @file components/LeaderboardComponents/ui/logic/Leaderboard.js
 * @description Leaderboard module.
 */
import GameService from "../../../../api/GameService";

/**
 * Represents the Leaderboard module and encapsulates its behavior.
 */
class Leaderboard {
    static instance;

    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        Leaderboard.instance = this;
        this.gameService = new GameService();
    }

    /**
     * Returns the singleton instance for this class.
     * @returns {*}
     */
    static getInstance() {
        if (!Leaderboard.instance) {
            Leaderboard.instance = new Leaderboard();
        }

        return Leaderboard.instance;
    }

    /**
     * Fetches data from a backend or external API endpoint.
     * @returns {Promise<*>}
     */
    async fetchResults() {
        const data = await this.gameService.getGlobalLeaderboard();
        return Array.isArray(data.results) ? data.results : [];
    }
}

export default Leaderboard;

