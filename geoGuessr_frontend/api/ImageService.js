import Service from "./AbstractService";

class ImageService extends Service {
    constructor(parameter) {
        super();
        this.parameter = parameter;
        this.images = [];
    }

    async fetchData() {
        const url = 'http://127.0.0.1/oe222ia/geoguessr_backend/api/random-location';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response Status: ${response.status}`);
            }

            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                this.images.push(data[i]['imageUrl']);
            }
            return this.images;
        } catch (e) {
            throw new Error(`Response Status: ${e}`);
        }
    }
}

export default ImageService;