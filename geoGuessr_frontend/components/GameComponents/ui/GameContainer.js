import "./StreetViewImage.js";
import "./OpenStreetMap.js";
import "./LivePointsContainer.js";
import Game from "../logic/Game.js";

/**
 * Primary game page layout and orchestration component.
 * Connects street-view, map input, round progress, and share-link UI.
 */
class GameContainer extends HTMLElement {
  /** Renders the game shell and binds interaction handlers. */
  connectedCallback() {
    this.innerHTML = `
     <div class="min-h-full py-3 lg:h-full lg:min-h-0 lg:overflow-hidden">
        <div class="mx-auto flex min-h-full max-w-7xl flex-col px-6 lg:h-full lg:min-h-0 lg:px-8">
          <div class="mb-3 fade-in-up">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Game Session</p>
            <h1 class="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">Find The Location</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">Study the image, place your pin, and submit your best guess.</p>
            <div class="mt-2 max-w-xs">
              <div class="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span>Progress</span>
                <span data-round-label>Round 1 / 5</span>
              </div>
              <div class="mt-1 h-1.5 rounded-full bg-slate-200">
                <div data-round-bar class="h-full w-[20%] rounded-full bg-teal-600 transition-all duration-300 ease-out"></div>
              </div>
            </div>
          </div>

          <div class="app-panel fade-in-up fade-in-delay-1 mb-3 overflow-hidden rounded-2xl">
            <div class="border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 sm:px-5">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Invite</p>
              <p class="text-sm text-slate-700">Share this exact game with a friend</p>
            </div>
            <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5 sm:py-4">
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

          <div class="flex flex-col gap-3 lg:min-h-0 lg:flex-1 lg:flex-row">
            <div class="play-card fade-in-up fade-in-delay-1 flex h-[22rem] w-full flex-col overflow-hidden rounded-3xl sm:h-[26rem] lg:h-auto lg:min-h-0 lg:w-1/2">
              <div class="shrink-0 px-4 pb-3 pt-4">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">Clue</p>
                <p class="mt-0.5 text-sm font-semibold text-slate-800">Street View</p>
              </div>
              <div class="min-h-0 flex-1 overflow-hidden px-3 pb-3">
                <div class="h-full rounded-2xl overflow-hidden border border-slate-200/70 bg-white">
                  <street-view-image></street-view-image>
                </div>
              </div>
            </div>

            <div class="play-card fade-in-up fade-in-delay-2 flex h-[22rem] w-full flex-col overflow-hidden rounded-3xl sm:h-[26rem] lg:h-auto lg:min-h-0 lg:w-1/2">
              <div class="shrink-0 px-4 pb-3 pt-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">Guess</p>
                    <p class="mt-0.5 text-sm font-semibold text-slate-800">Map Marker</p>
                  </div>
                  <live-points></live-points>
                </div>
              </div>
              <div class="min-h-0 flex-1 overflow-hidden px-3 pb-3">
                <div class="h-full rounded-2xl overflow-hidden border border-slate-200/70 bg-white">
                  <open-street-map></open-street-map>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 flex justify-center fade-in-up fade-in-delay-2">
            <button data-submit type="button" class="rounded-md bg-teal-700 px-12 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-600 transition-colors cursor-pointer">Guess</button>
          </div>
          <div data-game-status class="mt-2 text-center text-sm text-red-600"></div>
        </div>
      </div>
    `;

    this.streetView = this.querySelector("street-view-image");
    this.map = this.querySelector("open-street-map");
    this.button = this.querySelector("[data-submit]");
    this.shareInput = this.querySelector("[data-share-link]");
    this.copyButton = this.querySelector("[data-copy-link]");
    this.status = this.querySelector("[data-game-status]");
    this.roundLabel = this.querySelector("[data-round-label]");
    this.roundBar = this.querySelector("[data-round-bar]");

    // Centralized helper for inline error/status text.
    this.setStatus = (message = "") => {
      if (this.status) {
        this.status.textContent = message;
      }
    };

    this.onGameError = (event) => {
      const message = event?.detail?.message || "Could not save your result.";
      this.setStatus(message);
    };

    // Keeps header progress bar synchronized with game-round events.
    this.onRoundChanged = (event) => {
      const currentRound = Number(event?.detail?.currentRound || 1);
      const totalRounds = Number(event?.detail?.totalRounds || 5);
      const pct = Math.max(0, Math.min(100, Math.round((currentRound / totalRounds) * 100)));
      if (this.roundLabel) {
        this.roundLabel.textContent = `Round ${currentRound} / ${totalRounds}`;
      }
      if (this.roundBar) {
        this.roundBar.style.width = `${pct}%`;
      }
    };

    document.addEventListener("game-error", this.onGameError);
    document.addEventListener("game-round-changed", this.onRoundChanged);

    // Copies generated share URL for inviting a second player.
    this.copyButton.addEventListener("click", async () => {
      if (!this.shareInput.value || this.shareInput.value === "Generating...") {
        return;
      }
      try {
        await navigator.clipboard.writeText(this.shareInput.value);
        this.copyButton.textContent = "Copied";
        setTimeout(() => {
          this.copyButton.textContent = "Copy";
        }, 1200);
      } catch (e) {
        console.error("Clipboard failed:", e);
      }
    });

    this.addEventListener("game-ready", (event) => {
      const gameId = event.detail?.gameId;
      if (!gameId) {
        return;
      }
      const url = new URL(window.location.href);
      url.searchParams.set("gameId", gameId);
      this.shareInput.value = url.toString();
    });

    // Validates guess, submits round, and advances to next image.
    this.button.addEventListener("click", () => {
      this.setStatus("");
      const guess = this.map.getGuess();
      if (!guess) {
        this.setStatus("You must make a guess.");
        return;
      }

      let game;
      try {
        game = Game.getInstance();
      } catch (e) {
        console.error(`Game not ready yet: ${e}`);
        return;
      }

      game.submitGuess(guess);
      this.streetView.nextImage();
    });
  }

  /** Cleans up global listeners to avoid duplicate handlers on remount. */
  disconnectedCallback() {
    if (this.onGameError) {
      document.removeEventListener("game-error", this.onGameError);
    }
    if (this.onRoundChanged) {
      document.removeEventListener("game-round-changed", this.onRoundChanged);
    }
  }
}

customElements.define("game-container", GameContainer);
