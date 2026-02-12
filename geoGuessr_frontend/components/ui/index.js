
class Index extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="bg-gray-100 py-24 sm:py-32 min-h-screen">
      <div class="mx-auto mt-20 max-w-7xl px-6 lg:px-8 lg:mt-32">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base/7 font-semibold text-indigo-600">Geolocation Guesser</h2>
          <p class="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl"> Can you guess where you are?</p>

          <p class="mt-6 text-lg text-gray-700">
            Explore real street-level images from around the world and challenge your friends to see who has the sharpest sense of place.</p>

          <p class="mt-6 text-lg text-gray-700">
            <a class="underline font-medium" href="signUp.html">Sign Up</a> to start playing - or <a class="underline font-medium" href="login.html">Log In</a> to continue.</p>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('index-body', Index);
