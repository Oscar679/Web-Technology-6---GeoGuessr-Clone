/**
 * @file components/ui/PageLoader.js
 * @description Full-page loader overlay.
 */
class PageLoader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page-loader fixed inset-0 z-50 flex items-center justify-center" role="status" aria-live="polite">
                <div class="text-center">
                    <div class="loader"></div>
                    <p data-loader-label class="loader-label">Loading...</p>
                </div>
            </div>
        `;

        this.overlay = this.querySelector(".page-loader");
        this.label = this.querySelector("[data-loader-label]");
        this.hideTimer = null;
        this.pendingLoads = 0;
        this.pageLoaded = false;
        this.defaultLabel = "Loading...";

        this.updateVisibility = () => {
            if (!this.overlay) {
                return;
            }
            clearTimeout(this.hideTimer);
            if (this.pageLoaded && this.pendingLoads === 0) {
                this.overlay.classList.add("is-hidden");
            } else {
                this.overlay.classList.remove("is-hidden");
            }
        };

        this.showOverlay = (event) => {
            const message = event?.detail?.message;
            if (message && this.label) {
                this.label.textContent = message;
            } else if (this.label) {
                this.label.textContent = this.defaultLabel;
            }
            this.pendingLoads += 1;
            this.updateVisibility();
        };

        this.setMessage = (event) => {
            const message = event?.detail?.message;
            if (message && this.label) {
                this.label.textContent = message;
            }
        };

        this.hideOverlay = () => {
            this.pendingLoads = Math.max(0, this.pendingLoads - 1);
            if (this.pendingLoads === 0 && this.label) {
                this.label.textContent = this.defaultLabel;
            }
            this.updateVisibility();
        };

        this.handleWindowLoad = () => {
            this.pageLoaded = true;
            this.hideTimer = setTimeout(() => {
                this.updateVisibility();
            }, 1100);
        };

        window.addEventListener("load", this.handleWindowLoad, { once: true });
        document.addEventListener("app-loader:show", this.showOverlay);
        document.addEventListener("app-loader:hide", this.hideOverlay);
        document.addEventListener("app-loader:message", this.setMessage);
    }

    disconnectedCallback() {
        clearTimeout(this.hideTimer);
        document.removeEventListener("app-loader:show", this.showOverlay);
        document.removeEventListener("app-loader:hide", this.hideOverlay);
        document.removeEventListener("app-loader:message", this.setMessage);
    }
}

customElements.define("page-loader", PageLoader);
