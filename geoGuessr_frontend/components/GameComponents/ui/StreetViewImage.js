import GameService from "../../../api/GameService";
import Swiper from "swiper";
import "swiper/css";
import Game from "../logic/Game"

class StreetViewImage extends HTMLElement {
  constructor() {
    super();
    this.game;
    this.images;
    this.swiper;
    this._initialized = false;
  }
  async connectedCallback() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
      return;
    }
    const gameService = new GameService();
    try {
      const params = new URLSearchParams(window.location.search);
      const existingGameId = params.get("gameId");
      const data = existingGameId
        ? await gameService.getGame(existingGameId)
        : await gameService.startGame();

      if (!existingGameId) {
        const url = new URL(window.location.href);
        url.searchParams.set("gameId", data.gameId);
        window.history.replaceState({}, "", url.toString());
      }

      this.images = data.images;
      this.innerHTML = `
              <div class="swiper w-full h-full rounded-xl">
                <div class="swiper-wrapper">
                 ${this.images.map(img => `
                  <div class="swiper-slide">
                    <div class="overflow-hidden rounded-xl shadow-md bg-neutral-900 h-full">
                      <img 
                        src="${img.imageUrl}" 
                        alt="Street View Image"
                        class="w-full h-full object-cover"
                      >
                    </div>
                  </div>
                `).join('')}
                </div>
              </div>
            `;

      this.swiper = new Swiper(this.querySelector('.swiper'));

      const coordinates = this.images.map(img => ({
        lat: img.lat,
        lng: img.lng
      }));

      const game = Game.getInstance(coordinates);
      game.setGameId(data.gameId); // backend sets gameId
      this.dispatchEvent(new CustomEvent("game-ready", {
        detail: { gameId: data.gameId },
        bubbles: true
      }));

    } catch (err) {
      console.error("Error:", err);
    }
  }

  nextImage() {
    this.swiper.slideNext();
  }
}

customElements.define("street-view-image", StreetViewImage);
