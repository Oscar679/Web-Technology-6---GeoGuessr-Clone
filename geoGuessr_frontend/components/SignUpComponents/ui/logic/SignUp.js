/**
 * @file components/SignUpComponents/ui/logic/SignUp.js
 * @description SignUp module.
 */
import UserService from "../../../../api/UserService";

/**
 * Represents the SignUp module and encapsulates its behavior.
 */
class SignUp {
    static instance;

    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        SignUp.instance = this;
        this.userService = new UserService();
    }

    /**
     * Returns the singleton instance for this class.
     * @returns {*}
     */
    static getInstance() {
        if (!SignUp.instance) {
            SignUp.instance = new SignUp();
        }

        return SignUp.instance;
    }

    /**
     * Submits user input or game data to the backend.
     * @param {*} name
     * @param {*} password
     * @returns {Promise<*>}
     */
    async submit(name, password) {
        const trimmedName = (name || "").trim();
        const trimmedPassword = (password || "").trim();
        if (!trimmedName || !trimmedPassword) {
            return { ok: false, error: "Username and password required" };
        }

        const res = await this.userService.signUp(trimmedName, trimmedPassword);
        if (res.status === "created") {
            const login = await this.userService.logIn(trimmedName, trimmedPassword);
            if (login.token) {
                localStorage.setItem("token", login.token);
                return { ok: true };
            }
        }
        return { ok: false, error: res?.error || "Sign up failed" };
    }
}

export default SignUp;

