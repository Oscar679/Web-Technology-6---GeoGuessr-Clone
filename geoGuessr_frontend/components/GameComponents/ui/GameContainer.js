import './StreetViewImage.js';
import './OpenStreetMap.js';
import './SubmitBtn.js';
import Game from "../logic/Game.js"

class GameContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <div class="bg-gray-200 py-24 sm:py-32 min-h-screen">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">

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
                class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                type="button"
              >Copy</button>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-6 justify-center">

            <div class="w-full lg:w-[40vw] bg-white rounded-2xl shadow-lg p-4">
              <div class="h-[26rem] rounded-xl overflow-hidden bg-black">
                <street-view-image></street-view-image>
              </div>
            </div>

            <div class="w-full lg:w-[40vw] bg-white rounded-2xl shadow-lg p-4">
              <div class="h-[26rem] rounded-xl overflow-hidden">
                <open-street-map></open-street-map>
              </div>
            </div>

          </div>

          <div class="mt-10 flex justify-center">
            <submit-btn class="rounded-md bg-green-700 px-16 py-3 text-sm font-medium text-gray-100
               hover:bg-green-500 hover:text-white transition-colors cursor-pointer"></submit-btn>
          </div>

        </div>
      </div>
    `;

    this.streetView = this.querySelector('street-view-image');
    this.map = this.querySelector('open-street-map');
    this.button = this.querySelector('submit-btn');
    this.shareInput = this.querySelector('[data-share-link]');
    this.copyButton = this.querySelector('[data-copy-link]');

    this.button.innerHTML = 'Guess';

    this.copyButton.addEventListener("click", async () => {
      if (!this.shareInput.value || this.shareInput.value === "Generating...") {
        return;
      }
      try {
        await navigator.clipboard.writeText(this.shareInput.value);
        this.copyButton.innerHTML = 'Copied';
        setTimeout(() => {
          this.copyButton.innerHTML = 'Copy';
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

    this.button.addEventListener("click", () => {
      const guess = this.map.getGuess();
      if (!guess) {
        alert('You must make a guess.');
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
}

customElements.define("game-container", GameContainer);
