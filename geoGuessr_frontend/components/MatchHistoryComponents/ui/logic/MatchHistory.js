import GameService from "../../../../api/GameService";

/**
 * Provides match history data + derived summary stats for UI rendering.
 */
class MatchHistory {
    static instance;

    constructor() {
        MatchHistory.instance = this;
        this.gameService = new GameService();
    }

    /** Singleton getter used by the match history page component. */
    static getInstance() {
        if (!MatchHistory.instance) {
            MatchHistory.instance = new MatchHistory();
        }

        return MatchHistory.instance;
    }

    /**
     * Loads history from API and computes wins/losses/ties/win rate.
     * Pending games (no opponent score yet) are excluded from summary stats.
     */
    async fetchHistory() {
        const data = await this.gameService.getUserHistory();
        const games = Array.isArray(data.games) ? data.games : [];

        const finishedGames = games.filter((row) => row.opponent_score != null);
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
