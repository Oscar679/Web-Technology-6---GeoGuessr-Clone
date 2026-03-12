/**
 * @file components/LogInComponents/ui/logic/LogIn.js
 * @description LogIn module.
 */
import UserService from "../../../../api/UserService";

/**
 * Represents the LogIn module and encapsulates its behavior.
 */
class LogIn {
    static instance;

    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        LogIn.instance = this;
        this.userService = new UserService();
    }


    /**
     * Returns the singleton instance for this class.
     * @returns {*}
     */
    static getInstance() {
        if (!LogIn.instance) {
            LogIn.instance = new LogIn();
        }

        return LogIn.instance;
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

        try {
            const res = await this.userService.logIn(trimmedName, trimmedPassword);
            if (res.token) {
                localStorage.setItem("token", res.token);
                return { ok: true };
            }
            return { ok: false, error: res?.error || "Invalid credentials" };
        } catch (error) {
            return { ok: false, error: error?.cause?.message || error?.message || "Login failed" };
        }
    }
}

export default LogIn;

