/**
 * @file components/LeaderboardComponents/ui/LeaderboardContainer.js
 * @description LeaderboardContainer module.
 */
import Leaderboard from "./logic/Leaderboard";

/**
 * Represents the LeaderboardContainer module and encapsulates its behavior.
 */
class LeaderboardContainer extends HTMLElement {
    /**
     * Runs when the custom element is attached to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.innerHTML = `
            <div class="bg-gray-100 min-h-screen py-16">
                <div class="mx-auto max-w-4xl px-6">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-semibold text-gray-900">Leaderboard</h1>
                            <p class="text-sm text-gray-600">Top players by rating</p>
                        </div>
                        <a data-back-link class="text-sm font-medium text-green-700 hover:text-green-600" href="index.html">Back to home</a>
                    </div>

                    <div class="mt-8 rounded-xl bg-white shadow-lg">
                        <div class="border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-700">
                            Results
                        </div>
                        <div class="p-6">
                            <div data-status class="text-sm text-gray-600">Loading results...</div>
                            <div data-list class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadResults();
    }

    /**
     * Loads data required for the current view or component state.
     * @returns {Promise<*>}
     */
    async loadResults() {
        const status = this.querySelector("[data-status]");
        const list = this.querySelector("[data-list]");

        const leaderboard = Leaderboard.getInstance();
        try {
            const results = await leaderboard.fetchResults();

            if (results.length === 0) {
                status.textContent = "No results yet.";
                return;
            }

            status.classList.add("hidden");
            list.classList.remove("hidden");
            list.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="text-left text-gray-500">
                                <th class="py-2 pr-4">Rank</th>
                                <th class="py-2 pr-4">Player</th>
                                <th class="py-2 pr-4">Rating</th>
                                <th class="py-2 pr-4">Wins</th>
                                <th class="py-2 pr-4">Games</th>
                                <th class="py-2 pr-4">Win %</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-800">
                            ${results.map((row, index) => `
                                <tr class="border-t border-gray-100">
                                    <td class="py-2 pr-4 font-medium">${index + 1}</td>
                                    <td class="py-2 pr-4">${row.player_name}</td>
                                    <td class="py-2 pr-4">${row.rating ?? 0}</td>
                                    <td class="py-2 pr-4">${row.wins ?? 0}</td>
                                    <td class="py-2 pr-4">${row.games_played ?? 0}</td>
                                    <td class="py-2 pr-4">${row.win_pct ?? 0}%</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (e) {
            console.error("Leaderboard error:", e);
            status.textContent = "Unable to load results.";
        }
    }
}

customElements.define("leader-board", LeaderboardContainer);

