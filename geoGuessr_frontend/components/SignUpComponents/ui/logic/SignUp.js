import UserService from "../../../../api/UserService";

class SignUp {
    static instance;

    constructor() {
        SignUp.instance = this;
        this.userService = new UserService();
    }

    static getInstance() {
        if (!SignUp.instance) {
            SignUp.instance = new SignUp();
        }

        return SignUp.instance;
    }

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
