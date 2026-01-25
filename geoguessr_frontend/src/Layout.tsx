import {
    Menubar,
    MenubarMenu,
    MenubarTrigger
} from "./components/ui/menubar"

import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

export default function Layout() {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            api.get("/api/me")
                .then(res => setUsername(res.data.name))
                .catch(() => {
                    localStorage.removeItem("token");
                    setUsername(null);
                });
        };

        fetchUser();

        window.addEventListener("auth-changed", fetchUser);

        return () => {
            window.removeEventListener("auth-changed", fetchUser);
        };
    }, []);


    const handleLogout = async () => {
        try {
            await api.post("/api/logout");
        } catch { }

        localStorage.removeItem("token");
        setUsername(null);
        navigate("/login");
    };
    return (
        <>
            <Menubar className="border-0 min-h-18 sticky top-0 z-50 justify-center gap-6 px-4 shadow-md">
                <MenubarMenu>
                    <MenubarTrigger asChild className='px-14 hover:bg-indigo-600'>
                        <Link to="/Game">Start Game</Link>
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger asChild className='px-14 hover:bg-indigo-600'>
                        <Link to="/LeaderBoard">Leaderboard</Link>
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    {!username ? (
                        <MenubarTrigger asChild className="px-14 hover:bg-indigo-600 ml-auto">
                            <Link to="/Login">Log In</Link>
                        </MenubarTrigger>
                    ) : (
                        <MenubarTrigger
                            onClick={handleLogout}
                            className="px-14 hover:bg-indigo-600 ml-auto"
                        >
                            Log out
                        </MenubarTrigger>
                    )}
                </MenubarMenu>
            </Menubar>
            <Outlet />
        </>
    )
}