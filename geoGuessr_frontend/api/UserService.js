import Service from "./AbstractService";

/**
 * Handles authentication-related API calls.
 */
class UserService extends Service {
    constructor() {
        super();
    }

    /** Sends login credentials and returns API payload (token or error). */
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

    /** Sends registration request and returns API payload (status or error). */
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
