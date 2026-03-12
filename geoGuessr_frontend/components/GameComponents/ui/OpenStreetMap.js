import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's broken default marker icon paths when bundled with Vite/Webpack.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Inject marker animation styles once per page.
if (!document.getElementById("osm-styles")) {
    const style = document.createElement("style");
    style.id = "osm-styles";
    style.textContent = `
        @keyframes osm-pulse {
            0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
        .osm-actual-wrap { position: relative; width: 20px; height: 20px; }
        .osm-actual-pulse {
            position: absolute; top: 50%; left: 50%;
            width: 20px; height: 20px;
            background: rgba(34, 197, 94, 0.45);
            border-radius: 50%;
            animation: osm-pulse 1.6s ease-out infinite;
        }
        .osm-actual-dot {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 14px; height: 14px;
            background: #22c55e;
            border: 2.5px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 2px #15803d, 0 2px 8px rgba(0,0,0,0.3);
        }
        .osm-guess-dot {
            width: 14px; height: 14px;
            background: #3b82f6;
            border: 2.5px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 2px #1d4ed8, 0 2px 8px rgba(0,0,0,0.3);
        }
        .leaflet-tooltip.osm-label {
            background: rgba(15,23,42,0.82);
            border: none;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(0,0,0,0.25);
            color: #f1f5f9;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.03em;
            padding: 3px 7px;
            white-space: nowrap;
        }
        .leaflet-tooltip.osm-label::before { display: none; }
        .leaflet-popup-content-wrapper {
            border-radius: 10px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }
    `;
    document.head.appendChild(style);
}

const GUESS_ICON = L.divIcon({
    html: `<div class="osm-guess-dot"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    tooltipAnchor: [10, 0],
});

const ACTUAL_ICON = L.divIcon({
    html: `<div class="osm-actual-wrap"><div class="osm-actual-pulse"></div><div class="osm-actual-dot"></div></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    tooltipAnchor: [13, 0],
    popupAnchor: [0, -14],
});

/**
 * Leaflet wrapper component used for placing a single guess marker.
 */
class OpenStreetMap extends HTMLElement {
    connectedCallback() {
        this.style.display = "block";
        this.style.height = "100%";
        this.innerHTML = '<div id="map" style="height: 100%; width: 100%;"></div>';

        this.guessCoordinates = null;
        this._guessMarker = null;
        this._actualMarker = null;
        this._lineShadow = null;
        this._line = null;

        this._map = L.map(this.querySelector("#map")).setView([51.505, -0.09], 2);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(this._map);

        this._attachClickHandler();

        this._onGuessResult = (e) => {
            const { guessCoords, actualCoords, distance } = e.detail;

            // Remove previous result overlays.
            if (this._actualMarker) { this._actualMarker.remove(); }
            if (this._lineShadow) { this._lineShadow.remove(); }
            if (this._line) { this._line.remove(); }

            // Disable further clicking until next round.
            this._map.off("click");

            const pts = [
                [guessCoords.lat, guessCoords.lng],
                [actualCoords.lat, actualCoords.lng],
            ];

            // Shadow layer underneath gives the line a clean outlined look.
            this._lineShadow = L.polyline(pts, {
                color: "#fff",
                weight: 6,
                opacity: 0.55,
                lineCap: "round",
                lineJoin: "round",
            }).addTo(this._map);

            this._line = L.polyline(pts, {
                color: "#6366f1",
                weight: 2.5,
                opacity: 0.95,
                dashArray: "10 8",
                lineCap: "round",
                lineJoin: "round",
            }).addTo(this._map);

            const km = Math.round(distance).toLocaleString();
            this._actualMarker = L.marker([actualCoords.lat, actualCoords.lng], { icon: ACTUAL_ICON })
                .addTo(this._map)
                .bindTooltip("Actual location", { permanent: true, direction: "right", className: "osm-label" })
                .bindPopup(`<strong>Actual location</strong><br><span style="font-size:13px">${km} km away</span>`)
                .openPopup();

            // Update guess marker to use the styled icon and label.
            if (this._guessMarker) {
                this._guessMarker.setIcon(GUESS_ICON);
                this._guessMarker.bindTooltip("Your guess", { permanent: true, direction: "right", className: "osm-label" });
            }

            this._map.fitBounds(this._line.getBounds(), { padding: [50, 50] });
        };

        document.addEventListener("guess-result", this._onGuessResult);
    }

    _attachClickHandler() {
        this._map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            if (this._guessMarker) {
                this._guessMarker.setLatLng([lat, lng]);
            } else {
                this._guessMarker = L.marker([lat, lng], { icon: GUESS_ICON }).addTo(this._map);
            }
            this.guessCoordinates = { lat, lng };
        });
    }

    /** Returns current guess coordinates or null if nothing is selected yet. */
    getGuess() {
        return this.guessCoordinates;
    }

    /** Clears result overlays and re-enables clicking for the next round. */
    resetForNextRound() {
        if (this._actualMarker) { this._actualMarker.remove(); this._actualMarker = null; }
        if (this._lineShadow) { this._lineShadow.remove(); this._lineShadow = null; }
        if (this._line) { this._line.remove(); this._line = null; }
        if (this._guessMarker) { this._guessMarker.remove(); this._guessMarker = null; }

        this.guessCoordinates = null;
        this._map.setView([51.505, -0.09], 2);
        this._attachClickHandler();
    }

    disconnectedCallback() {
        document.removeEventListener("guess-result", this._onGuessResult);
        if (this._map) {
            this._map.remove();
            this._map = null;
        }
    }
}

customElements.define("open-street-map", OpenStreetMap);
