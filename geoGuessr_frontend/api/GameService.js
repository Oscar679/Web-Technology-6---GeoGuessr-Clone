import Service from "./AbstractService";

/**
 * Handles all game-related API calls.
 */
class GameService extends Service {
    constructor() {
        super();
    }

    /** Starts a new game for the authenticated user. */
    async startGame() {
        const token = localStorage.getItem("token");

        const response = await fetch(
            this.buildUrl("/api/startgame"),
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                mode: "cors"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    /** Loads an existing game by share id. */
    async getGame(gameId) {
        const token = localStorage.getItem("token");
        const response = await fetch(
            this.buildUrl(`/api/games/${gameId}`),
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                mode: "cors"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    /** Gets result rows for one game (used on completion page). */
    async getResults(gameId) {
        const token = localStorage.getItem("token");
        const response = await fetch(
            this.buildUrl(`/api/games/${gameId}/results`),
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                mode: "cors"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    /** Gets global top players for leaderboard page. */
    async getGlobalLeaderboard() {
        const response = await fetch(
            this.buildUrl("/api/leaderboard"),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    /** Gets authenticated user's match history list. */
    async getUserHistory() {
        const token = localStorage.getItem("token");
        const response = await fetch(
            this.buildUrl("/api/users/me/games"),
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                mode: "cors"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Submits final game score. Backend enforces one submission/user and 1v1 cap.
     */
    async saveResult(game) {
        const token = localStorage.getItem("token");

        const response = await fetch(
            this.buildUrl(`/api/games/${game.gameId}/result`),
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    score: game.score ?? 0
                })
            }
        );

        if (response.status === 409) {
            // Backend returns specific conflict reasons; surface those in UI.
            let message = "You have already played this game.";
            try {
                const data = await response.json();
                if (data?.error) {
                    message = data.error;
                }
            } catch {
                // Keep default message when response is not JSON.
            }
            throw new Error(message);
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    }
}

export default GameService;
