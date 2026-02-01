import ImageService from "../../api/ImageService";

class StreetViewImage extends HTMLElement {
    connectedCallback() {
        const service = new ImageService();
        service.fetchData().then(images => {
            console.log('Fetched images:', images);
        }).catch(err => {
            console.error('Error:', err);
        });
        this.innerHTML = `
        <img src="$locations["
        `
    }
}

customElements.define('street-view-image', StreetViewImage);