import '../../GameComponents/ui/SubmitBtn';
import SignUp from './logic/SignUp';

class SignUpContainer extends HTMLElement {
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
        <submit-btn class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"></submit-btn>
      </div>
    </form>

    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already have an account?
      <a href="logIn.html" class="font-semibold text-indigo-600 hover:text-indigo-500">Log in</a>
    </p>
  </div>
</div>
    `;

    this.username = this.querySelector('#username');
    this.password = this.querySelector('#password');
    this.button = this.querySelector('submit-btn');

    this.button.innerHTML = 'Sign up';

    this.button.addEventListener("click", async () => {
      const signUp = SignUp.getInstance();
      await signUp.submit(this.username.value, this.password.value);
    });
  }
}

customElements.define('sign-up', SignUpContainer);
