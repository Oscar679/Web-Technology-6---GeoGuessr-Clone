/**
 * @file components/ui/NavBar.js
 * @description NavBar module.
 */

class NavBar extends HTMLElement {
    /**
     * Runs when the custom element is attached to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.innerHTML = `
                <nav class="sticky top-0 z-50 border-b border-slate-900/10 bg-white/70 backdrop-blur-md">
                    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div class="relative flex h-16 items-center justify-between">
                            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <!-- Mobile menu button-->
                                <button data-mobile-button type="button" aria-expanded="false" class="relative inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition-colors hover:bg-teal-100/70 hover:text-teal-700 focus:outline-2 focus:-outline-offset-1 focus:outline-teal-700">
                                    <span class="absolute -inset-0.5"></span>
                                    <span class="sr-only">Open main menu</span>
                                    <svg data-menu-open-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
                                        <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg data-menu-close-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 hidden">
                                        <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div class="flex shrink-0 items-center">
                                    <a href="index.html" class="text-slate-700 hover:text-slate-950" aria-label="Home">
                                        <svg viewBox="0 0 24 24" class="h-8 w-8" aria-hidden="true">
                                            <defs>
                                                <radialGradient id="globeOcean" cx="35%" cy="30%" r="70%">
                                                    <stop offset="0%" stop-color="#60a5fa" />
                                                    <stop offset="100%" stop-color="#1e3a8a" />
                                                </radialGradient>
                                            </defs>
                                            <circle cx="12" cy="12" r="9" fill="url(#globeOcean)" />
                                            <path d="M6.5 9.5c1.2-2 3.4-3 5.6-2.4 1.4.4 2.5 1.3 3.9 1.5 1.2.2 1.7-.4 2.7-1.1-.3 2.8-2.1 5.1-5 5.8-2 .5-3.7-.2-5.3-1.4-.9-.7-1.7-1.6-1.9-2.4z" fill="#22c55e" />
                                            <path d="M8.3 15.1c.9-.8 2-.9 3.1-.6 1.3.3 2.1 1.3 3.2 1.8.7.3 1.5.2 2.3-.1-1 2.1-3.1 3.5-5.6 3.5-1.7 0-3.3-.7-4.3-1.9.4-.9.7-1.6 1.3-2.7z" fill="#16a34a" />
                                            <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.6" />
                                        </svg>
                                    </a>
                                </div>
                                <div class="hidden sm:ml-6 sm:block">
                                    <div class="flex space-x-4">
                                        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-white/5 hover:text-white" -->
                                        <a data-nav-link="leaderboard" href="Leaderboard.html" class="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700">Leaderboard</a>
                                        <a data-nav-link="history" href="MatchHistory.html" class="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700">Match History</a>
                                    </div>
                                        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <a data-nav-link="game" href="Game.html" aria-current="page" class="rounded-md bg-teal-700 px-16 py-2 text-sm font-medium text-white hover:bg-teal-600">Start Game</a>
                                        </div>
                                    </div>
                            </div>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <button type="button" class="relative rounded-full p-1 text-slate-500 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
                                     <a href="logIn.html" class="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700" data-auth-link>Log in</a>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div data-mobile-menu class="hidden border-t border-slate-200 bg-white/95 px-2 pb-3 pt-2 sm:hidden">
                        <a data-mobile-nav-link="game" href="Game.html" class="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700">Start Game</a>
                        <a data-mobile-nav-link="leaderboard" href="Leaderboard.html" class="mt-1 block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700">Leaderboard</a>
                        <a data-mobile-nav-link="history" href="MatchHistory.html" class="mt-1 block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700">Match History</a>
                        <a data-mobile-auth-link href="logIn.html" class="mt-1 block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-100/70 hover:text-teal-700">Log in</a>
                    </div>
                </nav>
        `

        const authLink = this.querySelector("[data-auth-link]");
        const mobileAuthLink = this.querySelector("[data-mobile-auth-link]");
        const token = localStorage.getItem("token");
        if (token) {
            authLink.textContent = "Log out";
            authLink.href = "#";
            if (mobileAuthLink) {
                mobileAuthLink.textContent = "Log out";
                mobileAuthLink.href = "#";
            }
            authLink.addEventListener("click", (event) => {
                event.preventDefault();
                localStorage.removeItem("token");
                window.location.href = "index.html";
            });
            mobileAuthLink?.addEventListener("click", (event) => {
                event.preventDefault();
                localStorage.removeItem("token");
                window.location.href = "index.html";
            });
        }

        const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        const activeKey = page === "leaderboard.html"
            ? "leaderboard"
            : page === "matchhistory.html"
                ? "history"
                : page === "game.html"
                    ? "game"
                    : "";

        if (activeKey) {
            const activeLink = this.querySelector(`[data-nav-link="${activeKey}"]`);
            const mobileActiveLink = this.querySelector(`[data-mobile-nav-link="${activeKey}"]`);
            if (activeLink) {
                if (activeKey === "game") {
                    // Keep button style unchanged when active.
                } else {
                    activeLink.classList.add("bg-teal-100/70", "text-teal-800");
                }
            }
            mobileActiveLink?.classList.add("bg-teal-100/70", "text-teal-800");
        }

        const mobileButton = this.querySelector("[data-mobile-button]");
        const mobileMenu = this.querySelector("[data-mobile-menu]");
        const openIcon = this.querySelector("[data-menu-open-icon]");
        const closeIcon = this.querySelector("[data-menu-close-icon]");

        mobileButton?.addEventListener("click", () => {
            const isOpen = mobileMenu?.classList.toggle("hidden") === false;
            mobileButton.setAttribute("aria-expanded", String(isOpen));
            openIcon?.classList.toggle("hidden", isOpen);
            closeIcon?.classList.toggle("hidden", !isOpen);
        });
    }
}

customElements.define('nav-bar', NavBar);

