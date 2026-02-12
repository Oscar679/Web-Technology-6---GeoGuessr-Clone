/**
 * @file components/GameComponents/ui/OpenStreetMap.js
 * @description OpenStreetMap module.
 */
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Represents the OpenStreetMap module and encapsulates its behavior.
 */
class OpenStreetMap extends HTMLElement {
    /**
     * Runs when the custom element is attached to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.style.display = 'block';
        this.style.height = '100%';
        this.innerHTML = '<div id="map" style="height: 100%; width: 100%;"></div>';
        this.guessCoordinates == null;

        const map = L.map(this.querySelector('#map')).setView([51.505, -0.09], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Â© OpenStreetMap contributors'
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
        });
    }

    /**
     * Returns derived or stored state from this component.
     * @returns {*}
     */
    getGuess() {
        return this.guessCoordinates;
    }
}

customElements.define('open-street-map', OpenStreetMap);
