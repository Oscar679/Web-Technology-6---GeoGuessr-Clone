import Service from "./AbstractService";
import Game from "../components/GameComponents/logic/Game"

class ImageService extends Service {
    constructor(parameter) {
        super();
        this.parameter = parameter;
        this.images = [];
        this.coordinates = [];
        this.game;
    }

    async fetchData() {
        const url = 'http://127.0.0.1/oe222ia/geoguessr_backend/api/random-location';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response Status: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);
            for (let i = 0; i < data.length; i++) {
                this.images.push(data[i]['imageUrl']);
                this.coordinates.push({
                    lat: data[i].lat,
                    lng: data[i].lng
                });
            }
            Game.getInstance(this.coordinates);
            return this.images;
        } catch (e) {
            throw new Error(`Response Status: ${e}`);
        }
    }

    getCoordinates() {
        return this.coordinates;
    }
}

export default ImageService;