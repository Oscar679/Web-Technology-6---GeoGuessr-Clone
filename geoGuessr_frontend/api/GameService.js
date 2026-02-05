import Service from "./AbstractService";

class GameService extends Service {
    constructor() {
        super();

    }

    async fetchData() {
        const url = 'http://127.0.0.1/oe222ia/geoguessr_backend/api/startgame';

        try {
            const response = await fetch(url, {
                method: "PUT"
            });
            if (!response.ok) {
                throw new Error(`Response Status: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);
        } catch (e) {
            throw new Error(`Response Status: ${e}`);
        }
    }
}

export default GameService;