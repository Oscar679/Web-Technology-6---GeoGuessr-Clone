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
            <submit-btn class="rounded-md bg-green-700 px-16 py-3 text-sm font-medium text-gray-100
               hover:bg-green-500 hover:text-white transition-colors cursor-pointer"></submit-btn>
          </div>

        </div>
      </div>
    `;

    this.streetView = this.querySelector('street-view-image');
    this.map = this.querySelector('open-street-map');
    this.button = this.querySelector('submit-btn');

    this.button.innerHTML = 'Guess';

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
