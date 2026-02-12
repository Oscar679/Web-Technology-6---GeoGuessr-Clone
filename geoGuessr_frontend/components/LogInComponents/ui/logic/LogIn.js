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
        const res = await this.userService.logIn(name, password);
        if (res.token) {
            localStorage.setItem("token", res.token);
            return { ok: true };
        }
        return { ok: false, error: res?.error || "Invalid credentials" };
    }
}

export default LogIn;

