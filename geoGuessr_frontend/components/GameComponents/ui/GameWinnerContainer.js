import GameService from "../../../api/GameService";

/**
 * Game completion view for 1v1 outcome + sharing controls.
 * Shows waiting state for opponent and hides share section after both have played.
 */
class GameWinnerContainer extends HTMLElement {
    /** Initializes API dependency for result loading. */
    constructor() {
        super();
        this.gameService = new GameService();
    }

    /** Renders static markup and starts loading using gameId from URL. */
    connectedCallback() {
        this.innerHTML = `
        <section class="mx-auto mt-6 w-full max-w-3xl px-6 lg:px-8" data-winner-root>
            <div class="app-panel overflow-hidden rounded-2xl">
                <div class="border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-5 py-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Outcome</p>
                    <p data-title class="mt-1 text-lg font-semibold text-slate-900"></p>
                    <p data-subtitle class="mt-1 text-sm text-slate-600"></p>
                </div>
                <div class="grid gap-2 px-5 py-4 sm:grid-cols-2">
                    <p data-player-1-score class="player-1-score rounded-lg border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-800"></p>
                    <p data-player-2-score class="player-2-score rounded-lg border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-800"></p>
                </div>
            </div>
            <div data-share-section class="app-panel mt-4 overflow-hidden rounded-2xl">
                <div class="border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-5 py-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Share</p>
                    <p class="mt-1 text-sm text-slate-700">Invite someone to play this exact challenge.</p>
                </div>
                <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
                    <div class="text-sm font-medium text-slate-700">Shareable link</div>
                    <div class="flex w-full sm:max-w-xl gap-2">
                      <input
                        data-share-link
                        type="text"
                        readonly
                        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                        value="Generating..."
                      />
                      <button
                        data-copy-link
                        class="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors cursor-pointer"
                        type="button"
                      >Copy</button>
                    </div>
                </div>
            </div>
            <div class="mt-5 flex justify-center">
                <a href="Game.html" class="rounded-md bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 transition-colors">Play Again</a>
            </div>
        </section>
        `;
        this.loadWinnerFromUrl();
    }

    /** Reads `gameId` from query string and routes to the result-loading flow. */
    async loadWinnerFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get("gameId");
        if (!gameId) {
            const title = this.querySelector("[data-title]");
            const subtitle = this.querySelector("[data-subtitle]");
            const shareInput = this.querySelector("[data-share-link]");
            const copyButton = this.querySelector("[data-copy-link]");
            if (title && subtitle) {
                title.textContent = "Game complete";
                subtitle.textContent = "No game id found in URL.";
            }
            if (shareInput) {
                shareInput.value = "No game id available";
            }
            if (copyButton) {
                copyButton.disabled = true;
            }
            return;
        }

        this.setShareLink(gameId);
        await this.loadWinner(gameId);
    }

    /** Fetches results and derives winner/tie/waiting presentation state. */
    async loadWinner(gameId) {
        const title = this.querySelector("[data-title]");
        const subtitle = this.querySelector("[data-subtitle]");
        const player1ScoreElement = this.querySelector("[data-player-1-score]");
        const player2ScoreElement = this.querySelector("[data-player-2-score]");
        const shareSection = this.querySelector("[data-share-section]");
        if (!title || !subtitle) {
            return;
        }

        title.textContent = "Calculating result...";
        subtitle.textContent = "Fetching leaderboard for this game.";
        if (player1ScoreElement) {
            player1ScoreElement.textContent = "Player 1: waiting...";
        }
        if (player2ScoreElement) {
            player2ScoreElement.textContent = "Player 2: waiting...";
        }

        try {
            const data = await this.gameService.getResults(gameId);
            const results = Array.isArray(data?.results) ? data.results : [];
            if (shareSection) {
                shareSection.classList.toggle("hidden", results.length >= 2);
            }

            if (results.length === 0) {
                title.textContent = "Result unavailable";
                subtitle.textContent = "No submitted scores found yet.";
                return;
            }

            if (results.length === 1) {
                title.textContent = "Round complete";
                subtitle.textContent = "Waiting for an opponent to finish this game.";
                return;
            }

            const first = results[0];
            const second = results[1];
            const firstScore = Number(first.score);
            const secondScore = Number(second.score);

            if (player1ScoreElement && player2ScoreElement) {
                player1ScoreElement.textContent = `${first.player_name}: ${Math.round(firstScore)} km`;
                player2ScoreElement.textContent = `${second.player_name}: ${Math.round(secondScore)} km`;
            }

            // Lower score wins in this game mode.
            let winner = null;
            if (firstScore < secondScore) {
                winner = first;
            } else if (secondScore < firstScore) {
                winner = second;
            }

            // Equal scores are treated as a tie.
            if (!winner) {
                title.textContent = "It's a tie";
                subtitle.textContent = `Both players finished with ${Math.round(firstScore)} km.`;
                return;
            }

            title.textContent = "Game complete";
            subtitle.textContent = `Winner: ${winner.player_name} (${Math.round(Number(winner.score))} km).`;
        } catch (error) {
            console.error("Winner banner failed:", error);
            title.textContent = "Result unavailable";
            subtitle.textContent = "Could not load winner data for this game.";
        }
    }

    /** Builds and wires the share link copy action for this game. */
    setShareLink(gameId) {
        const shareInput = this.querySelector("[data-share-link]");
        const copyButton = this.querySelector("[data-copy-link]");
        if (!shareInput || !copyButton) {
            return;
        }

        const shareUrl = new URL("Game.html", window.location.href);
        shareUrl.searchParams.set("gameId", gameId);
        shareInput.value = shareUrl.toString();

        copyButton.disabled = false;
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(shareInput.value);
                copyButton.textContent = "Copied";
                setTimeout(() => {
                    copyButton.textContent = "Copy";
                }, 1200);
            } catch (error) {
                console.error("Clipboard failed:", error);
            }
        });
    }
}

customElements.define("game-winner", GameWinnerContainer);
