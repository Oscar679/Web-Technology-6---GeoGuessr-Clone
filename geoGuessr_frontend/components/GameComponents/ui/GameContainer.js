import './StreetViewImage.js';
import './OpenStreetMap.js';
import './SubmitBtn.js';
import Game from "../logic/Game.js"

class GameContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <div class="bg-gray-200 py-24 sm:py-32 min-h-screen">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">

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
            <submit-btn></submit-btn>
          </div>

        </div>
      </div>
    `;

    this.streetView = this.querySelector('street-view-image');
    this.map = this.querySelector('open-street-map');
    this.button = this.querySelector('submit-btn');

    this.button.addEventListener("click", () => {
      if (!Game.instance) {
        console.error('Game not ready yet, please wait.');
        return;
      }
      const guess = this.map.getGuess();
      Game.instance.submitGuess(guess);
    });
  }
}

customElements.define("game-container", GameContainer);
