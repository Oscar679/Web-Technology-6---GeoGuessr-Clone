import L from "leaflet";
import "leaflet/dist/leaflet.css";

class OpenStreetMap extends HTMLElement {
    connectedCallback() {
        this.style.display = 'block';
        this.style.height = '100%';
        this.innerHTML = '<div id="map" style="height: 100%; width: 100%;"></div>';
        this.guessCoordinates == null;

        const map = L.map(this.querySelector('#map')).setView([51.505, -0.09], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        let marker = null;

        map.on('click', (e) => {
            const { lat, lng } = e.latlng;

            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng]).addTo(map);
            }

            this.guessCoordinates = { lat, lng };
            this.dispatchEvent(new CustomEvent('guess', { detail: { lat, lng } }));

            console.log(this.getGuess());
        });
    }

    getGuess() {
        return this.guessCoordinates;
    }
}

customElements.define('open-street-map', OpenStreetMap);