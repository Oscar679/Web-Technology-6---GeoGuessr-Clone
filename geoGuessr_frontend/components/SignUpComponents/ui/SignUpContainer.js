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
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" class="mx-auto h-10 w-auto" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form action="#" method="POST" class="space-y-6">
      <div>
        <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
        <div class="mt-2">
          <input id="username" type="username" name="username" required autocomplete="username" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
        <div class="mt-2">
          <input id="password" type="password" name="password" required autocomplete="new-password" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button id="submit" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">Sign up</button>
      </div>
    </form>

    <p data-status class="mt-4 text-center text-sm text-gray-600"></p>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already have an account?
      <a href="logIn.html" class="font-semibold text-indigo-600 hover:text-indigo-500">Log in</a>
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

