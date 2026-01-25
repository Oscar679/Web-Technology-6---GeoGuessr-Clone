import api from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        handleLogOut();
    }, []);
    const handleLogOut = async () => {
        try {
            await api.post("/api/logout");
        } catch (e) {
            console.warn("Logout failed.");
        }

        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        // redirect
        navigate("/Login");
    }
    return (
        <button
            onClick={handleLogOut}
            className="text-sm text-red-400 hover:text-red-300"
        >
            Log out
        </button>
    )
}