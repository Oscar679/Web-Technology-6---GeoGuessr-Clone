
import LogIn from './logic/LogIn';

class LogInContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-20">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" class="mx-auto h-10 w-auto" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form action="#" method="POST" class="space-y-6">
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Username</label>
        <div class="mt-2">
          <input id="username" type="username" name="username" required autocomplete="username" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
        </div>
        <div class="mt-2">
          <input id="password" type="password" name="password" required autocomplete="current-password" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button id="submit" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">Log in</button>
    </div>
    </form>

    <p data-status class="mt-4 text-center text-sm text-gray-600"></p>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Not a member?
      <a href="signUp.html" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign up</a>
    </p>
  </div>
</div>
    `;

    this.form = this.querySelector('form');
    this.username = this.querySelector('#username');
    this.password = this.querySelector('#password');
    this.button = this.querySelector('#submit');

    this.button.innerHTML = 'Log in';

    this.status = this.querySelector('[data-status]');

    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const logIn = LogIn.getInstance();
      this.button.innerHTML = 'Logging in...';
      this.status.textContent = '';
      this.button.classList.add('opacity-70');
      this.button.classList.add('pointer-events-none');

      const result = await logIn.submit(this.username.value, this.password.value);
      if (result.ok) {
        this.button.innerHTML = 'Success';
        this.status.textContent = 'Login successful';
        this.status.classList.remove('text-red-600');
        this.status.classList.add('text-green-700');
        setTimeout(() => {
          window.location.href = 'Game.html';
        }, 600);
      } else {
        this.button.innerHTML = 'Log in';
        this.status.textContent = result.error || 'Login failed';
        this.status.classList.remove('text-green-700');
        this.status.classList.add('text-red-600');
        this.button.classList.remove('opacity-70');
        this.button.classList.remove('pointer-events-none');
      }
    });
  }
}

customElements.define('log-in', LogInContainer);
