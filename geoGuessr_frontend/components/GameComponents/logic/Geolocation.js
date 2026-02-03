// Singleton implementation
class Geolocation {
    static instance;
    constructor(lat, lng) {
        if (Geolocation.instance) {
            return Geolocation.instance;
        }

        Geolocation.instance = this;

        this.lat = lat;
        this.lng = lng;
    }

    static haversine(locations, guessedCoordinates) {
        // distance between latitudes
        // and longitudes
        console.log(guessedCoordinates);
        let lat1 = locations['lat'];
        let lon1 = locations['lng'];

        let lat2 = guessedCoordinates['lat'];
        let lon2 = guessedCoordinates['lng'];

        console.log(lat1, lon1, lat2, lon2);

        let dLat = (lat2 - lat1) * Math.PI / 180.0;
        let dLon = (lon2 - lon1) * Math.PI / 180.0;

        // convert to radiansa
        lat1 = (lat1) * Math.PI / 180.0;
        lat2 = (lat2) * Math.PI / 180.0;

        // apply formulae
        let a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        let rad = 6371;
        let c = 2 * Math.asin(Math.sqrt(a));
        return rad * c;
    }
}

export default Geolocation;