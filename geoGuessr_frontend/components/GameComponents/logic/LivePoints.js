/**
 * Lightweight score model for the live-points UI element.
 */
class LivePoints {
    /** Stores rounded distance score so UI renders whole-number kilometers. */
    updatePoints(points) {
        this.points = Math.round(points);
        return this.points;
    }
}

export default LivePoints;
