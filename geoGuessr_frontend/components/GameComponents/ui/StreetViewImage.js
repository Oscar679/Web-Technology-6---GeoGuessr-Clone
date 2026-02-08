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
  }
  async connectedCallback() {
    const gameService = new GameService();
    try {
      const data = await gameService.fetchData();
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

    } catch (err) {
      console.error("Error:", err);
    }
  }

  nextImage() {
    this.swiper.slideNext();
  }
}

customElements.define("street-view-image", StreetViewImage);