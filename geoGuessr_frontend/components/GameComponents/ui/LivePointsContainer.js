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
    <section class="mx-auto mt-8 w-full max-w-7xl px-6 lg:px-8">
        <div class="live-points rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Live Points</p>
                    <h2 class="text-sm font-medium text-gray-700">Current score</h2>
                </div>
                <p id="points" class="text-3xl font-extrabold text-gray-900 tabular-nums sm:text-4xl">${this.points}</p>
            </div>
        </div>
    </section>
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

