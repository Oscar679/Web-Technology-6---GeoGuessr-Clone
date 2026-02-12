/**
 * @file components/GameComponents/ui/GameWinnerContainer.js
 * @description GameWinnerContainer module.
 */
import GameService from "../../../api/GameService";

/**
 * Represents the GameWinnerContainer module and encapsulates its behavior.
 */
class GameWinnerContainer extends HTMLElement {
    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        super();
        this.gameService = new GameService();
    }

    /**
     * Runs when the custom element is attached to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.innerHTML = `
        <section class="mx-auto mt-6 w-full max-w-3xl px-6 lg:px-8" data-winner-root>
            <div class="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <p data-title class="text-lg font-semibold text-gray-900"></p>
                <p data-subtitle class="mt-1 text-sm text-gray-600"></p>
                <p data-player-1-score class="player-1-score mt-4 text-sm text-gray-800"></p>
                <p data-player-2-score class="player-2-score mt-1 text-sm text-gray-800"></p>
            </div>
        </section>
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="text-sm text-gray-700 font-medium">Shareable link</div>
            <div class="flex w-full sm:max-w-xl gap-2">
              <input
                data-share-link
                type="text"
                readonly
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                value="Generating..."
              />
              <button
                data-copy-link
                class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors cursor-pointer"
                type="button"
              >Copy</button>
            </div>
          </div>
        `;
        this.loadWinnerFromUrl();
    }

    /**
     * Loads data required for the current view or component state.
     * @returns {Promise<*>}
     */
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

    /**
     * Loads data required for the current view or component state.
     * @param {*} gameId
     * @returns {Promise<*>}
     */
    async loadWinner(gameId) {
        const title = this.querySelector("[data-title]");
        const subtitle = this.querySelector("[data-subtitle]");
        const player1ScoreElement = this.querySelector("[data-player-1-score]");
        const player2ScoreElement = this.querySelector("[data-player-2-score]");
        if (!title || !subtitle) {
            return;
        }

        title.textContent = "Calculating result...";
        subtitle.textContent = "Fetching leaderboard for this game.";
        if (player1ScoreElement) {
            player1ScoreElement.textContent = "";
        }
        if (player2ScoreElement) {
            player2ScoreElement.textContent = "";
        }

        try {
            const data = await this.gameService.getResults(gameId);
            const results = Array.isArray(data?.results) ? data.results : [];

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

            // Lower score is better in this game.
            let winner = null;
            if (firstScore < secondScore) {
                winner = first;
            } else if (secondScore < firstScore) {
                winner = second;
            }

            // if its a tie.
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

    /**
     * Sets internal state used by this component.
     * @param {*} gameId
     * @returns {void}
     */
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

