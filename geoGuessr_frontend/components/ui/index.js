/**
 * @file components/ui/Index.js
 * @description Index module.
 */

class Index extends HTMLElement {
  /**
   * Runs when the custom element is attached to the DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.innerHTML = `
    <div class="py-24 sm:py-32 min-h-screen">
      <div class="mx-auto mt-16 max-w-7xl px-6 lg:px-8 lg:mt-28">
        <div class="app-panel mx-auto max-w-3xl rounded-3xl px-8 py-12 text-center lg:px-12">
          <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 ring-1 ring-teal-200/60">
            <svg viewBox="0 0 24 24" class="h-10 w-10" aria-hidden="true">
              <defs>
                <radialGradient id="heroGlobe" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stop-color="#60a5fa" />
                  <stop offset="100%" stop-color="#1e3a8a" />
                </radialGradient>
              </defs>
              <circle cx="12" cy="12" r="9" fill="url(#heroGlobe)" />
              <path d="M6.5 9.5c1.2-2 3.4-3 5.6-2.4 1.4.4 2.5 1.3 3.9 1.5 1.2.2 1.7-.4 2.7-1.1-.3 2.8-2.1 5.1-5 5.8-2 .5-3.7-.2-5.3-1.4-.9-.7-1.7-1.6-1.9-2.4z" fill="#22c55e" />
              <path d="M8.3 15.1c.9-.8 2-.9 3.1-.6 1.3.3 2.1 1.3 3.2 1.8.7.3 1.5.2 2.3-.1-1 2.1-3.1 3.5-5.6 3.5-1.7 0-3.3-.7-4.3-1.9.4-.9.7-1.6 1.3-2.7z" fill="#16a34a" />
              <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.6" />
            </svg>
          </div>
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Geolocation Guesser</p>
          <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">Can you guess where you are?</h1>

          <p class="mt-6 text-lg text-slate-600 leading-relaxed">
            Explore real street-level images from around Europe, then challenge a friend on the exact same route.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a class="rounded-md bg-teal-700 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600" href="signUp.html">Create account</a>
            <a class="rounded-md border border-slate-300 bg-white/70 px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-white" href="logIn.html">Log in</a>
          </div>

          <div class="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/70 pt-8">
            <div class="text-center">
              <p class="text-2xl font-bold text-teal-700">5</p>
              <p class="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Rounds</p>
            </div>
            <div class="text-center border-x border-slate-200/70">
              <p class="text-2xl font-bold text-teal-700">1v1</p>
              <p class="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Challenge</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-teal-700">EU</p>
              <p class="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Locations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('index-body', Index);

