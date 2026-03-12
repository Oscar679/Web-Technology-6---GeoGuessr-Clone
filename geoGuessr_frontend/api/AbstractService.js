/**
 * Base API service with URL normalization shared by concrete services.
 */
class Service {
    constructor() {
        if (this.constructor == Service) {
            throw new Error(`${this.constructor.name} is an abstract class and cannot be instantiated.`);
        }

        // Supports both absolute API hosts and relative "/api" style paths.
        this.apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    }

    /**
     * Builds an API URL while avoiding duplicate "/api/api" segments.
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

    /** Returns a bearer token header when the user is authenticated. */
    getAuthHeaders() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /** Performs a JSON request and normalizes non-OK responses into Errors. */
    async requestJson(path, options = {}) {
        const response = await fetch(this.buildUrl(path), options);
        let data = null;

        try {
            data = await response.json();
        } catch {
            // Non-JSON responses are allowed; callers still receive HTTP-based errors.
        }

        if (!response.ok) {
            const message = data?.error || `HTTP ${response.status}`;
            const error = new Error(message);
            error.status = response.status;
            error.payload = data;
            throw error;
        }

        return data;
    }
}

export default Service;
