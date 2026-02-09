import GameService from "../../../api/GameService";

class MatchHistoryContainer extends HTMLElement {
    connectedCallback() {
        this.renderSkeleton();
        this.loadHistory();
    }

    renderSkeleton() {
        this.innerHTML = `
            <div class="bg-gray-100 min-h-screen py-16">
                <div class="mx-auto max-w-4xl px-6">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-semibold text-gray-900">Match History</h1>
                            <p class="text-sm text-gray-600">Your recent games</p>
                        </div>
                        <a class="text-sm font-medium text-green-700 hover:text-green-600" href="Game.html">Back to game</a>
                    </div>

                    <div class="mt-8 rounded-xl bg-white shadow-lg">
                        <div class="border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-700">
                            Games
                        </div>
                        <div class="p-6">
                            <div data-status class="text-sm text-gray-600">Loading matches...</div>
                            <div data-list class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadHistory() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const status = this.querySelector("[data-status]");
        const list = this.querySelector("[data-list]");

        const gameService = new GameService();
        try {
            const data = await gameService.getUserHistory();
            const games = Array.isArray(data.games) ? data.games : [];

            if (games.length === 0) {
                status.textContent = "No games played yet.";
                return;
            }

            status.classList.add("hidden");
            list.classList.remove("hidden");
            list.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="text-left text-gray-500">
                                <th class="py-2 pr-4">Game ID</th>
                                <th class="py-2 pr-4">Score</th>
                                <th class="py-2 pr-4">Opponent</th>
                                <th class="py-2 pr-4">Completed</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-800">
                            ${games.map((row) => {
                                const completedAt = new Date(row.completed_at);
                                const diffMs = Date.now() - completedAt.getTime();
                                const minutesAgo = Math.max(0, Math.floor(diffMs / 60000));
                                const hoursAgo = Math.floor(minutesAgo / 60);
                                const timeLabel = hoursAgo >= 1 ? `${hoursAgo}h ago` : `${minutesAgo}m ago`;
                                return `
                                <tr class="border-t border-gray-100">
                                    <td class="py-2 pr-4 font-mono text-xs">${row.game_id}</td>
                                    <td class="py-2 pr-4">${row.score}</td>
                                    <td class="py-2 pr-4">${row.opponent_name ?? "Waiting"}</td>
                                    <td class="py-2 pr-4">${timeLabel}</td>
                                </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (e) {
            console.error("History error:", e);
            status.textContent = "Unable to load match history.";
        }
    }
}

customElements.define("match-history", MatchHistoryContainer);
