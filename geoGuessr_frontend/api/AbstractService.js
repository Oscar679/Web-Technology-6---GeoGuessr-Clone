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

        this.apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    }

    /**
     * Fetches data from a backend or external API endpoint.
     * @returns {void}
     */
    fetchData() {
        throw new Error("Method fetchdata() must be implemented.");
    }

    /**
     * Builds a fully qualified API URL from a path segment.
     * @param {*} path
     * @returns {*}
     */
    buildUrl(path) {
        const normalizedPath = String(path || "").startsWith("/") ? String(path) : `/${String(path || "")}`;

        if (!this.apiBaseUrl) {
            return normalizedPath;
        }

        // Avoid duplicate /api when base is /api and path already starts with /api.
        if (this.apiBaseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
            return `${this.apiBaseUrl}${normalizedPath.slice(4)}`;
        }

        if (this.apiBaseUrl.endsWith('/api') && normalizedPath === '/api') {
            return this.apiBaseUrl;
        }

        return `${this.apiBaseUrl}${normalizedPath}`;
    }
}

export default Service;
