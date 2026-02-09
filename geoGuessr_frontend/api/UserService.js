import Service from "./AbstractService";

class UserService extends Service {
    constructor() {
        super();
    }

    async logIn(name, password) {
        const url = 'http://127.0.0.1/oe222ia/geoguessr_backend/api/login';

        try {
            return fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            }).then(r => r.json());
        } catch (e) {
            throw new Error(`Response Status: ${e}`);
        }
    }

    async signUp(name, password) {
        const url = 'http://127.0.0.1/oe222ia/geoguessr_backend/api/register';

        try {
            return fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            }).then(r => r.json());
        } catch (e) {
            throw new Error(`Response Status: ${e}`);
        }
    }
}

export default UserService;
