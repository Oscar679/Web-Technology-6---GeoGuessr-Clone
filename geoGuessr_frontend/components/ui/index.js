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
      <div class="mx-auto mt-20 max-w-7xl px-6 lg:px-8 lg:mt-32">
        <div class="app-panel mx-auto max-w-3xl rounded-3xl px-8 py-12 text-center lg:px-12">
          <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Geolocation Guesser</h2>
          <p class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">Can you guess where you are?</p>

          <p class="mt-6 text-lg text-slate-700">
            Explore real street-level images from around Europe, then challenge a friend on the exact same route.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a class="rounded-md bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-600" href="signUp.html">Create account</a>
            <a class="rounded-md border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-white" href="logIn.html">Log in</a>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('index-body', Index);

