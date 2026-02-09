import Service from "./AbstractService";

class GameService extends Service {
    constructor() {
        super();
    }

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

    async saveResult(game) {
        const token = localStorage.getItem("token");

        await fetch(
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
    }
}

export default GameService;
