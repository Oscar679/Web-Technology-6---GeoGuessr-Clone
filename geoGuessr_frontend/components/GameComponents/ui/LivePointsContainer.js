/**
 * @file components/GameComponents/ui/LivePointsContainer.js
 * @description LivePointsContainer module.
 */
import LivePoints from "../logic/LivePoints";

/**
 * Represents the LivePointsContainer module and encapsulates its behavior.
 */
class LivePointsContainer extends HTMLElement {
    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        super();
        this.points = 0;
    }

    /**
     * Runs when the custom element is attached to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.innerHTML = `
        <div class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Score</p>
            <p id="points" class="text-lg font-extrabold text-teal-700 tabular-nums">${this.points}</p>
        </div>
    `;
    }

    /**
     * Updates component or game state after an interaction.
     * @param {*} points
     * @returns {void}
     */
    updatePoints(points) {
        const logic = new LivePoints();
        const pointsElement = this.querySelector('#points');
        if (pointsElement) {
            this.points = logic.updatePoints(points);
            pointsElement.textContent = this.points;
        }
    }
}

customElements.define('live-points', LivePointsContainer);

