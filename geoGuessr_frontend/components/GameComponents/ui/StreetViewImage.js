import ImageService from "../../../api/ImageService";
import Swiper from "swiper";
import "swiper/css";
import Game from "../logic/Game"

class StreetViewImage extends HTMLElement {
  constructor() {
    super();
    this.game;
  }
  async connectedCallback() {
    const service = new ImageService();
    try {
      const images = await service.fetchData();
      this.innerHTML = `
              <div class="swiper w-full h-full rounded-xl">
                <div class="swiper-wrapper">
                  ${images.map(url => `
                    <div class="swiper-slide">
                      <div class="overflow-hidden rounded-xl shadow-md bg-neutral-900 h-full">
                        <img 
                          src="${url}" 
                          alt="Street View Image"
                          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        >
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;

      new Swiper(this.querySelector('.swiper'), {
        loop: true,
        spaceBetween: 16,
        grabCursor: true,
      });

      this.game = new Game(service.getCoordinates());
    } catch (err) {
      console.error("Error:", err);
    }
  }

}

customElements.define("street-view-image", StreetViewImage);