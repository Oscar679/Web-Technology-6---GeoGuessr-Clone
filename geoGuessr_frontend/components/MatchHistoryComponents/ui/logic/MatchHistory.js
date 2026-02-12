/**
 * @file components/MatchHistoryComponents/ui/logic/MatchHistory.js
 * @description MatchHistory module.
 */
import GameService from "../../../../api/GameService";

/**
 * Represents the MatchHistory module and encapsulates its behavior.
 */
class MatchHistory {
    static instance;

    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        MatchHistory.instance = this;
        this.gameService = new GameService();
    }

    /**
     * Returns the singleton instance for this class.
     * @returns {*}
     */
    static getInstance() {
        if (!MatchHistory.instance) {
            MatchHistory.instance = new MatchHistory();
        }

        return MatchHistory.instance;
    }

    /**
     * Fetches data from a backend or external API endpoint.
     * @returns {Promise<*>}
     */
    async fetchHistory() {
        const data = await this.gameService.getUserHistory();
        const games = Array.isArray(data.games) ? data.games : [];
        const finishedGames = games.filter((row) => row.opponent_score !== null && row.opponent_score !== undefined);
        const wins = finishedGames.filter((row) => row.score < row.opponent_score).length;
        const losses = finishedGames.filter((row) => row.score > row.opponent_score).length;
        const ties = finishedGames.filter((row) => row.score === row.opponent_score).length;
        const total = finishedGames.length;
        const winPct = total > 0 ? Math.round((wins / total) * 100) : 0;

        return {
            games,
            summary: {
                wins,
                losses,
                ties,
                total,
                winPct
            }
        };
    }
}

export default MatchHistory;

