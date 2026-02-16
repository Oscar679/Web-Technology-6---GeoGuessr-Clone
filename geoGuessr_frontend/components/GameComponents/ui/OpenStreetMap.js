import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Leaflet wrapper component used for placing a single guess marker.
 */
class OpenStreetMap extends HTMLElement {
    connectedCallback() {
        this.style.display = "block";
        this.style.height = "100%";
        this.innerHTML = '<div id="map" style="height: 100%; width: 100%;"></div>';

        // Holds latest clicked coordinates for current round.
        this.guessCoordinates = null;

        const map = L.map(this.querySelector("#map")).setView([51.505, -0.09], 2);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);

        let marker = null;

        map.on("click", (e) => {
            const { lat, lng } = e.latlng;

            if (marker) {
                // Reposition existing marker instead of adding more markers.
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng]).addTo(map);
            }

            this.guessCoordinates = { lat, lng };
        });
    }

    /** Returns current guess coordinates or null if nothing is selected yet. */
    getGuess() {
        return this.guessCoordinates;
    }
}

customElements.define("open-street-map", OpenStreetMap);
