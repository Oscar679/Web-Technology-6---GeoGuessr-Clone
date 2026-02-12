/**
 * @file components/GameComponents/ui/SubmitBtn.js
 * @description SubmitBtn module.
 */

class SubmitBtn extends HTMLElement {
    /**
     * Runs when the custom element is attached to the DOM.
     * @returns {void}
     */
    connectedCallback() {

        this.innerHTML =
            `
        <button type='submit'></button>
`;
    }
}

customElements.define("submit-btn", SubmitBtn);
