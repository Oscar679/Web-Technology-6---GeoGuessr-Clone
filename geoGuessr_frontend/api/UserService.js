/**
 * @file api/UserService.js
 * @description UserService module.
 */
import Service from "./AbstractService";

/**
 * Represents the UserService module and encapsulates its behavior.
 */
class UserService extends Service {
    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        super();
    }

    /**
     * Executes the logIn workflow for this module.
     * @param {*} name
     * @param {*} password
     * @returns {Promise<*>}
     */
    async logIn(name, password) {
        const url = this.buildUrl("/api/login");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            });
            return await response.json();
        } catch (e) {
            throw new Error("Login request failed", { cause: e });
        }
    }

    /**
     * Executes the signUp workflow for this module.
     * @param {*} name
     * @param {*} password
     * @returns {Promise<*>}
     */
    async signUp(name, password) {
        const url = this.buildUrl("/api/register");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            });
            return await response.json();
        } catch (e) {
            throw new Error("Sign-up request failed", { cause: e });
        }
    }
}

export default UserService;

