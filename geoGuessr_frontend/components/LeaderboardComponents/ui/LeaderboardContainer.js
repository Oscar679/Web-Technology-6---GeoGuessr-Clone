import Leaderboard from "./logic/Leaderboard";

/**
 * Leaderboard page component.
 * Shows top-three spotlight cards and full ranking table from API data.
 */
class LeaderboardContainer extends HTMLElement {
    /** Renders page shell and triggers initial leaderboard load. */
    connectedCallback() {
        this.innerHTML = `
            <div class="min-h-screen py-16">
                <div class="mx-auto max-w-4xl px-6">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-semibold text-slate-900">Leaderboard</h1>
                            <p class="text-sm text-slate-600">Top players by rating</p>
                        </div>
                        <a data-back-link class="text-sm font-medium text-teal-700 hover:text-teal-600" href="index.html">Back to home</a>
                    </div>

                    <div class="app-panel mt-8 overflow-hidden rounded-2xl">
                        <div class="border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-5">
                            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Rankings</p>
                            <h2 class="mt-1 text-lg font-semibold text-slate-900">Top Players</h2>
                            <p class="text-sm text-slate-600">Performance based on rating, wins and win percentage.</p>
                        </div>
                        <div class="p-6">
                            <div data-status class="text-sm text-slate-600">Loading results...</div>
                            <div data-list class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadResults();
    }

    /** Fetches leaderboard rows and maps rank-based visual styles. */
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

            // Spotlight panel for the podium while still keeping full table below.
            const topThree = results.slice(0, 3);
            list.innerHTML = `
                <div class="mb-5 grid gap-3 sm:grid-cols-3">
                    ${topThree.map((row, index) => `
                        <div class="rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
                            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">#${index + 1}</p>
                            <p class="mt-1 truncate text-sm font-semibold text-slate-900">${row.player_name}</p>
                            <p class="mt-1 text-sm text-teal-700">${row.rating ?? 0} rating</p>
                        </div>
                    `).join("")}
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="text-left text-slate-500">
                                <th class="py-2 pr-4">Rank</th>
                                <th class="py-2 pr-4">Player</th>
                                <th class="py-2 pr-4">Rating</th>
                                <th class="py-2 pr-4">Wins</th>
                                <th class="py-2 pr-4">Games</th>
                                <th class="py-2 pr-4">Win %</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-800">
                            ${results.map((row, index) => {
                const rank = index + 1;

                // Color coding reinforces podium positions in rank badges.
                const rankTone = rank === 1
                    ? "bg-amber-100 text-amber-800"
                    : rank === 2
                        ? "bg-slate-200 text-slate-700"
                        : rank === 3
                            ? "bg-orange-100 text-orange-800"
                            : "bg-slate-100 text-slate-700";

                const rowTone = rank <= 3 ? "bg-teal-50/40" : "";
                return `
                                <tr class="border-t border-slate-100 ${rowTone}">
                                    <td class="py-2 pr-4 font-medium">
                                        <span class="inline-flex min-w-7 items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold ${rankTone}">${rank}</span>
                                    </td>
                                    <td class="py-2 pr-4">${row.player_name}</td>
                                    <td class="py-2 pr-4">${row.rating ?? 0}</td>
                                    <td class="py-2 pr-4">${row.wins ?? 0}</td>
                                    <td class="py-2 pr-4">${row.games_played ?? 0}</td>
                                    <td class="py-2 pr-4">${row.win_pct ?? 0}%</td>
                                </tr>
                            `;
            }).join("")}
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
