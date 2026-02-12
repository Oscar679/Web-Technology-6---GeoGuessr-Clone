/**
 * @file components/GameComponents/logic/LivePoints.js
 * @description LivePoints module.
 */

class LivePoints {

    /**
     * Updates component or game state after an interaction.
     * @param {*} points
     * @returns {void}
     */
    updatePoints(points) {
        return this.points = Math.round(points);
    }
}


export default LivePoints;
