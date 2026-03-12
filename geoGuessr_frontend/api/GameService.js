import Service from "./AbstractService";

/**
 * Handles all game-related API calls.
 */
class GameService extends Service {
    /** Starts a new game for the authenticated user. */
    async startGame() {
        return this.requestJson("/api/startgame", {
            method: "POST",
            headers: {
                ...this.getAuthHeaders(),
                "Content-Type": "application/json"
            },
            mode: "cors"
        });
    }

    /** Loads an existing game by share id. */
    async getGame(gameId) {
        return this.requestJson(`/api/games/${gameId}`, {
            method: "GET",
            headers: {
                ...this.getAuthHeaders(),
                "Content-Type": "application/json"
            },
            mode: "cors"
        });
    }

    /** Gets result rows for one game (used on completion page). */
    async getResults(gameId) {
        return this.requestJson(`/api/games/${gameId}/results`, {
            method: "GET",
            headers: {
                ...this.getAuthHeaders(),
                "Content-Type": "application/json"
            },
            mode: "cors"
        });
    }

    /** Gets global top players for leaderboard page. */
    async getGlobalLeaderboard() {
        return this.requestJson("/api/leaderboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors"
        });
    }

    /** Gets authenticated user's match history list. */
    async getUserHistory() {
        return this.requestJson("/api/users/me/games", {
            method: "GET",
            headers: {
                ...this.getAuthHeaders(),
                "Content-Type": "application/json"
            },
            mode: "cors"
        });
    }

    /**
     * Submits final game score. Backend enforces one submission/user and 1v1 cap.
     */
    async saveResult(game) {
        await this.requestJson(`/api/games/${game.gameId}/result`, {
            method: "POST",
            headers: {
                ...this.getAuthHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                score: game.score ?? 0
            })
        });
    }
}

export default GameService;
