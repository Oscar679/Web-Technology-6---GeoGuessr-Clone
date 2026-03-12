import Service from "./AbstractService";

/**
 * Handles authentication-related API calls.
 */
class UserService extends Service {
    /** Sends login credentials and returns API payload (token or error). */
    async logIn(name, password) {
        try {
            return await this.requestJson("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            });
        } catch (e) {
            throw new Error("Login request failed", { cause: e });
        }
    }

    /** Sends registration request and returns API payload (status or error). */
    async signUp(name, password) {
        try {
            return await this.requestJson("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            });
        } catch (e) {
            throw new Error("Sign-up request failed", { cause: e });
        }
    }
}

export default UserService;
