import Service from "./AbstractService";

class GameService extends Service {
    constructor() {
        super();
    }

    async fetchData() {
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
