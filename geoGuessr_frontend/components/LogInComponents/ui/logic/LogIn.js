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
        console.log("Submitting login:", name, password);
        const res = await this.userService.logIn(name, password);
        if (res.token) {
            console.log('log in successful');
        } else {
            console.error('log in failed');
        }
    }
}

export default LogIn;