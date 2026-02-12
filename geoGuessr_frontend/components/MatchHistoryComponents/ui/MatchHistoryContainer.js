import MatchHistory from "./logic/MatchHistory";

class MatchHistoryContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="bg-gray-100 min-h-screen py-16">
                <div class="mx-auto max-w-4xl px-6">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-semibold text-gray-900">Match History</h1>
                            <p class="text-sm text-gray-600">Your recent games</p>
                        </div>
                        <a class="text-sm font-medium text-green-700 hover:text-green-600" href="index.html">Back to home</a>
                    </div>

                    <div class="mt-8 rounded-xl bg-white shadow-lg">
                        <div class="border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-700">
                            Games
                        </div>
                        <div class="p-6">
                            <div data-summary class="mb-4 text-sm text-gray-700"></div>
                            <div data-status class="text-sm text-gray-600">Loading matches...</div>
                            <div data-list class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadHistory();
    }

    async loadHistory() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "logIn.html";
            return;
        }

        const status = this.querySelector("[data-status]");
        const list = this.querySelector("[data-list]");
        const summary = this.querySelector("[data-summary]");

        const matchHistory = MatchHistory.getInstance();
        try {
            const data = await matchHistory.fetchHistory();
            const games = data.games;
            const summaryData = data.summary;

            if (games.length === 0) {
                summary.textContent = "";
                status.textContent = "No games played yet.";
                return;
            }

            summary.innerHTML = `
                <span class="font-medium">Record:</span>
                <span class="text-green-700">${summaryData.wins}W</span>
                <span class="text-gray-400">-</span>
                <span class="text-red-700">${summaryData.losses}L</span>
                <span class="ml-2 text-gray-500">(${summaryData.winPct}% win)</span>
            `;

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
                let outcomeClass = "bg-white";
                if (row.opponent_score !== null && row.opponent_score !== undefined) {
                    if (row.score < row.opponent_score) {
                        outcomeClass = "bg-green-50";
                    } else if (row.score > row.opponent_score) {
                        outcomeClass = "bg-red-50";
                    } else {
                        outcomeClass = "bg-gray-50";
                    }
                }
                return `
                                <tr class="border-t border-gray-100 ${outcomeClass}">
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
