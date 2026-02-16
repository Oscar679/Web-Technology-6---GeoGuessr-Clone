import GameService from "../../../api/GameService";
import Swiper from "swiper";
import "swiper/css";
import Game from "../logic/Game";

/**
 * Loads game images and drives the street-view carousel.
 */
class StreetViewImage extends HTMLElement {
  constructor() {
    super();
    this.images = undefined;
    this.swiper = undefined;
    this._initialized = false;
  }

  /** Emits global event to show full-page loader. */
  showLoader(message = "Loading...") {
    document.dispatchEvent(new CustomEvent("app-loader:show", {
      detail: { message }
    }));
  }

  /** Emits global event to hide full-page loader. */
  hideLoader() {
    document.dispatchEvent(new CustomEvent("app-loader:hide"));
  }

  /** Waits until a specific image resolves with either load or error. */
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

  /** Loads game payload, initializes swiper, and bootstraps Game singleton. */
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
        // Persist generated gameId in URL so it can be shared immediately.
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
                 ${this.images.map((img) => `
                  <div class="swiper-slide">
                    <div class="overflow-hidden rounded-xl shadow-md h-full">
                      <img 
                        src="${img.imageUrl}" 
                        alt="Street View Image"
                        class="w-full h-full object-cover"
                      >
                    </div>
                  </div>
                `).join("")}
                </div>
              </div>
            `;

      this.swiper = new Swiper(this.querySelector(".swiper"), {
        // Manual swipe is disabled to enforce one-guess-per-round flow.
        allowTouchMove: false
      });

      const firstImage = this.querySelector(".swiper-slide:first-child img");
      await this.waitForImage(firstImage);

      const coordinates = this.images.map((img) => ({
        lat: img.lat,
        lng: img.lng
      }));

      const game = Game.getInstance(coordinates);
      game.setGameId(data.gameId);

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

  /** Moves to next image and shows loader if next slide is not cached yet. */
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
