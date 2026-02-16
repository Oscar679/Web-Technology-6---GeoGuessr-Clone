import MatchHistory from "./logic/MatchHistory";

/**
 * Match history page component.
 * Renders aggregate stats and a row-by-row table with relative timestamps.
 */
class MatchHistoryContainer extends HTMLElement {
    /** Renders static layout and then loads authenticated user history. */
    connectedCallback() {
        this.innerHTML = `
            <div class="min-h-screen py-16">
                <div class="mx-auto max-w-4xl px-6">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-semibold text-slate-900">Match History</h1>
                            <p class="text-sm text-slate-600">Your recent games</p>
                        </div>
                        <a class="text-sm font-medium text-teal-700 hover:text-teal-600" href="index.html">Back to home</a>
                    </div>

                    <div class="app-panel mt-8 overflow-hidden rounded-2xl">
                        <div class="border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-5">
                            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">History</p>
                            <h2 class="mt-1 text-lg font-semibold text-slate-900">Recent Matches</h2>
                            <p class="text-sm text-slate-600">Your latest completed and pending 1v1 games.</p>
                        </div>
                        <div class="p-6">
                            <div data-summary class="mb-4 text-sm text-slate-700"></div>
                            <div data-status class="text-sm text-slate-600">Loading matches...</div>
                            <div data-list class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadHistory();
    }

    /** Fetches history, computes table rows, and paints summary widgets. */
    async loadHistory() {
        const token = localStorage.getItem("token");
        // History is protected; redirect unauthenticated users to login.
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
                <div class="grid gap-2 sm:grid-cols-4">
                    <div class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2">
                        <p class="text-xs uppercase tracking-wide text-slate-500">Wins</p>
                        <p class="text-base font-semibold text-green-700">${summaryData.wins}</p>
                    </div>
                    <div class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2">
                        <p class="text-xs uppercase tracking-wide text-slate-500">Losses</p>
                        <p class="text-base font-semibold text-red-700">${summaryData.losses}</p>
                    </div>
                    <div class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2">
                        <p class="text-xs uppercase tracking-wide text-slate-500">Ties</p>
                        <p class="text-base font-semibold text-slate-700">${summaryData.ties}</p>
                    </div>
                    <div class="rounded-lg border border-slate-200 bg-white/80 px-3 py-2">
                        <p class="text-xs uppercase tracking-wide text-slate-500">Win Rate</p>
                        <p class="text-base font-semibold text-teal-700">${summaryData.winPct}%</p>
                    </div>
                </div>
            `;

            status.classList.add("hidden");
            list.classList.remove("hidden");
            list.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="text-left text-slate-500">
                                <th class="py-2 pr-4">Result</th>
                                <th class="py-2 pr-4">Game ID</th>
                                <th class="py-2 pr-4">Score</th>
                                <th class="py-2 pr-4">Opponent</th>
                                <th class="py-2 pr-4">Completed</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-800">
                            ${games.map((row) => {
                // Convert completion timestamp into short relative labels for readability.
                const completedAt = new Date(row.completed_at);
                const diffMs = Date.now() - completedAt.getTime();
                const minutesAgo = Math.max(0, Math.floor(diffMs / 60000));
                const hoursAgo = Math.floor(minutesAgo / 60);
                const daysAgo = Math.floor(hoursAgo / 24);
                let timeLabel = `${minutesAgo}m ago`;
                if (hoursAgo >= 24) {
                    timeLabel = daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
                } else if (hoursAgo >= 1) {
                    timeLabel = `${hoursAgo}h ago`;
                }

                let outcomeClass = "bg-white";
                let outcomeLabel = "Pending";
                let outcomeBadgeClass = "bg-slate-100 text-slate-700";
                if (row.opponent_score != null) {
                    if (row.score < row.opponent_score) {
                        outcomeClass = "bg-green-50";
                        outcomeLabel = "W";
                        outcomeBadgeClass = "bg-green-100 text-green-800";
                    } else if (row.score > row.opponent_score) {
                        outcomeClass = "bg-red-50";
                        outcomeLabel = "L";
                        outcomeBadgeClass = "bg-red-100 text-red-800";
                    } else {
                        outcomeClass = "bg-slate-50";
                        outcomeLabel = "T";
                        outcomeBadgeClass = "bg-slate-200 text-slate-700";
                    }
                }

                return `
                                <tr class="border-t border-slate-100 ${outcomeClass}">
                                    <td class="py-2 pr-4">
                                        <span class="inline-flex min-w-7 items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold ${outcomeBadgeClass}">${outcomeLabel}</span>
                                    </td>
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
