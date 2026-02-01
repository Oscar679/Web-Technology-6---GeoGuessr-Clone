class Service {
    constructor() {
        if (this.constructor == Service) {
            throw new Error(`${this.constructor.name} is an abstract class and cannot be instantiated.`);
        }
    }

    fetchData() {
        throw new Error("Method fetchdata() must be implemented.");
    }
}

export default Service;