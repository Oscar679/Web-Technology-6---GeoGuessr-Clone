import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1/oe222ia/geoguessr_backend",
    headers: {
        Accept: "application/json",
    },
});

// Lägg på token automatiskt om den finns
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
