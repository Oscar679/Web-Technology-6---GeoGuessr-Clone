
class SubmitBtn extends HTMLElement {
    connectedCallback() {

        this.innerHTML =
            `
        <button
        class="rounded-md bg-green-700 px-16 py-3 text-sm font-medium text-gray-100
               hover:bg-green-500 hover:text-white transition-colors">
        Guess
      </button>
`;
    }
}

customElements.define("submit-btn", SubmitBtn);