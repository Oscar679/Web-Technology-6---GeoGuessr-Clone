class GameContainer extends HTMLElement {
  connectedCallback() {
    // Grab children BEFORE overwrite
    const streetView = this.querySelector('[slot="street-view"]');
    const map = this.querySelector('[slot="map"]');

    this.innerHTML = `
      <div class="bg-gray-200 py-24 sm:py-32 min-h-screen">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="flex flex-col lg:flex-row gap-6 justify-center">

            <div class="w-full lg:w-[40vw] bg-white rounded-2xl shadow-lg p-4">
              <div id="streetViewTarget" class="h-[26rem] rounded-xl overflow-hidden bg-black"></div>
            </div>

            <div class="w-full lg:w-[40vw] bg-white rounded-2xl shadow-lg p-4">
              <div id="mapTarget" class="h-[26rem] rounded-xl overflow-hidden"></div>
            </div>

          </div>
        </div>
      </div>
    `;

    if (streetView) {
      this.querySelector('#streetViewTarget').appendChild(streetView);
    }

    if (map) {
      this.querySelector('#mapTarget').appendChild(map);
    }
  }
}

customElements.define("game-container", GameContainer);
