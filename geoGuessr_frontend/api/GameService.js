/**
 * @file api/GameService.js
 * @description GameService module.
 */
import Service from "./AbstractService";

/**
 * Represents the GameService module and encapsulates its behavior.
 */
class GameService extends Service {
    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        super();
    }

    /**
     * Executes the startGame workflow for this module.
     * @returns {Promise<*>}
     */
    async startGame() {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost/oe222ia/geoguessr_backend/api/startgame",
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

    /**
     * Returns derived or stored state from this component.
     * @param {*} gameId
     * @returns {Promise<*>}
     */
    async getGame(gameId) {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost/oe222ia/geoguessr_backend/api/games/${gameId}`,
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
     * Returns derived or stored state from this component.
     * @param {*} gameId
     * @returns {Promise<*>}
     */
    async getResults(gameId) {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost/oe222ia/geoguessr_backend/api/games/${gameId}/results`,
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
     * Returns derived or stored state from this component.
     * @returns {Promise<*>}
     */
    async getGlobalLeaderboard() {
        const response = await fetch(
            "http://localhost/oe222ia/geoguessr_backend/api/leaderboard",
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

    /**
     * Returns derived or stored state from this component.
     * @returns {Promise<*>}
     */
    async getUserHistory() {
        const token = localStorage.getItem("token");
        const response = await fetch(
            "http://localhost/oe222ia/geoguessr_backend/api/users/me/games",
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
     * Executes the saveResult workflow for this module.
     * @param {*} game
     * @returns {Promise<*>}
     */
    async saveResult(game) {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost/oe222ia/geoguessr_backend/api/games/${game.gameId}/result`,
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

