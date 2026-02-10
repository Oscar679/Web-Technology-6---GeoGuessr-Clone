import UserService from "../../../../api/UserService";

class LogIn {
    static instance;

    constructor() {
        LogIn.instance = this;
        this.userService = new UserService();
    }


    static getInstance() {
        if (!LogIn.instance) {
            LogIn.instance = new LogIn();
        }

        return LogIn.instance;
    }

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
