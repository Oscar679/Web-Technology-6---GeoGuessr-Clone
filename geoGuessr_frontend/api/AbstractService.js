/**
 * @file api/AbstractService.js
 * @description AbstractService module.
 */
class Service {
    /**
     * Initializes instance state and service dependencies.
     */
    constructor() {
        if (this.constructor == Service) {
            throw new Error(`${this.constructor.name} is an abstract class and cannot be instantiated.`);
        }
    }

    /**
     * Fetches data from a backend or external API endpoint.
     * @returns {void}
     */
    fetchData() {
        throw new Error("Method fetchdata() must be implemented.");
    }
}

export default Service;
