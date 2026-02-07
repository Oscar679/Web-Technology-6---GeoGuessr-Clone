
class SubmitBtn extends HTMLElement {
    connectedCallback() {

        this.innerHTML =
            `
        <button type='submit'></button>
`;
    }
}

customElements.define("submit-btn", SubmitBtn);