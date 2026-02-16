/**
 * @file components/SignUpComponents/ui/SignUpContainer.js
 * @description SignUpContainer module.
 */
import SignUp from './logic/SignUp';

/**
 * Represents the SignUpContainer module and encapsulates its behavior.
 */
class SignUpContainer extends HTMLElement {
  /**
   * Runs when the custom element is attached to the DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.innerHTML = `
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-20">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-700">G</div>
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
  </div>

  <div class="app-panel mt-10 rounded-2xl px-6 py-6 sm:mx-auto sm:w-full sm:max-w-sm">
    <form action="#" method="POST" class="space-y-6">
      <div>
        <label for="username" class="block text-sm/6 font-medium text-slate-800">Username</label>
        <div class="mt-2">
          <input id="username" type="username" name="username" required autocomplete="username" class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 focus:outline-none sm:text-sm/6" />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm/6 font-medium text-slate-800">Password</label>
        <div class="mt-2">
          <input id="password" type="password" name="password" required autocomplete="new-password" class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 focus:outline-none sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button id="submit" type="submit" class="flex w-full justify-center rounded-md bg-teal-700 px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 cursor-pointer">Sign up</button>
      </div>
    </form>

    <p data-status class="mt-4 text-center text-sm text-slate-600"></p>

    <p class="mt-8 text-center text-sm/6 text-slate-600">
      Already have an account?
      <a href="logIn.html" class="font-semibold text-teal-700 hover:text-teal-600">Log in</a>
    </p>
  </div>
</div>
    `;

    this.form = this.querySelector('form');
    this.username = this.querySelector('#username');
    this.password = this.querySelector('#password');
    this.button = this.querySelector('#submit');
    this.status = this.querySelector('[data-status]');

    this.button.innerHTML = 'Sign up';

    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const signUp = SignUp.getInstance();
      this.button.innerHTML = 'Signing up...';
      this.status.textContent = '';
      this.button.classList.add('opacity-70');
      this.button.classList.add('pointer-events-none');

      const result = await signUp.submit(this.username.value, this.password.value);
      if (result.ok) {
        this.button.innerHTML = 'Success';
        this.status.textContent = 'Account created';
        this.status.classList.remove('text-red-600');
        this.status.classList.add('text-green-700');
        setTimeout(() => {
          window.location.href = 'Game.html';
        }, 600);
      } else {
        this.button.innerHTML = 'Sign up';
        this.status.textContent = result.error || 'Sign up failed';
        this.status.classList.remove('text-green-700');
        this.status.classList.add('text-red-600');
        this.button.classList.remove('opacity-70');
        this.button.classList.remove('pointer-events-none');
      }
    });
  }
}

customElements.define('sign-up', SignUpContainer);

