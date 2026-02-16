/**
 * Utility methods for geographic calculations.
 */
class Geolocation {
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    /**
     * Returns great-circle distance in kilometers between answer and guess.
     */
    static haversine(locations, guessedCoordinates) {
        let lat1 = locations["lat"];
        let lon1 = locations["lng"];

        let lat2 = guessedCoordinates["lat"];
        let lon2 = guessedCoordinates["lng"];

        let dLat = (lat2 - lat1) * Math.PI / 180.0;
        let dLon = (lon2 - lon1) * Math.PI / 180.0;

        // Convert coordinates to radians.
        lat1 = lat1 * Math.PI / 180.0;
        lat2 = lat2 * Math.PI / 180.0;

        // Apply Haversine formula.
        const a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        const rad = 6371;
        const c = 2 * Math.asin(Math.sqrt(a));

        return rad * c;
    }
}

export default Geolocation;
