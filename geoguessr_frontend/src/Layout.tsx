import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger
} from "./components/ui/menubar"

import { Outlet, Link } from "react-router-dom"

export default function Layout() {
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
            </Menubar>
            <Outlet />
        </>
    )
}