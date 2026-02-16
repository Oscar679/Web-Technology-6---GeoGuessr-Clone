/**
 * @file components/GameComponents/ui/StreetViewImage.js
 * @description StreetViewImage module.
 */
import GameService from "../../../api/GameService";
import Swiper from "swiper";
import "swiper/css";
import Game from "../logic/Game"

/**
 * Represents the StreetViewImage module and encapsulates its behavior.
 */
class StreetViewImage extends HTMLElement {
  /**
   * Initializes instance state and service dependencies.
   */
  constructor() {
    super();
    this.images;
    this.swiper;
    this._initialized = false;
  }

  /**
   * Emits event to show global page loader.
   * @returns {void}
   */
  showLoader(message = "Loading...") {
    document.dispatchEvent(new CustomEvent("app-loader:show", {
      detail: { message }
    }));
  }

  /**
   * Emits event to hide global page loader.
   * @returns {void}
   */
  hideLoader() {
    document.dispatchEvent(new CustomEvent("app-loader:hide"));
  }

  /**
   * Waits until an image element is loaded (or errored).
   * @param {HTMLImageElement | null} imageElement
   * @returns {Promise<void>}
   */
  waitForImage(imageElement) {
    return new Promise((resolve) => {
      if (!imageElement || imageElement.complete) {
        resolve();
        return;
      }

      const done = () => resolve();
      imageElement.addEventListener("load", done, { once: true });
      imageElement.addEventListener("error", done, { once: true });
    });
  }
  /**
   * Runs when the custom element is attached to the DOM.
   * @returns {Promise<*>}
   */
  async connectedCallback() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "logIn.html";
      return;
    }
    const gameService = new GameService();
    this.showLoader("Preparing challenge...");
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
      document.dispatchEvent(new CustomEvent("app-loader:message", {
        detail: { message: "Loading first street-view image..." }
      }));
      this.innerHTML = `
              <div class="swiper w-full h-full rounded-xl">
                <div class="swiper-wrapper">
                 ${this.images.map(img => `
                  <div class="swiper-slide">
                    <div class="overflow-hidden rounded-xl shadow-md h-full">
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

      this.swiper = new Swiper(this.querySelector('.swiper'), {
        allowTouchMove: false
      });

      const firstImage = this.querySelector(".swiper-slide:first-child img");
      await this.waitForImage(firstImage);

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
    } finally {
      this.hideLoader();
    }
  }

  /**
   * Advances to the next item in the current flow.
   * @returns {void}
   */
  nextImage() {
    if (!this.swiper) {
      return;
    }

    this.swiper.once("slideChangeTransitionEnd", async () => {
      const activeImage = this.querySelector(".swiper-slide-active img");
      if (activeImage && !activeImage.complete) {
        this.showLoader("Loading next image...");
        await this.waitForImage(activeImage);
        this.hideLoader();
      }
    });
    this.swiper.slideNext();
  }
}

customElements.define("street-view-image", StreetViewImage);

