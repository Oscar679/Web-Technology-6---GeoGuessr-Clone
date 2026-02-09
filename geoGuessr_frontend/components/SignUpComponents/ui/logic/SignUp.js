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
            console.error("Username and password required");
            return;
        }

        const res = await this.userService.signUp(trimmedName, trimmedPassword);
        if (res.status === "created") {
            const login = await this.userService.logIn(trimmedName, trimmedPassword);
            if (login.token) {
                localStorage.setItem("token", login.token);
                console.log("sign up successful");
                window.location.href = "Game.html";
                return;
            }
        }
        console.error("sign up failed");
    }
}

export default SignUp;
