import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Menubar, MenubarMenu, MenubarTrigger } from "./components/ui/menubar";
import { Outlet, Link } from "react-router-dom";
export default function Layout() {
    return (_jsxs(_Fragment, { children: [_jsxs(Menubar, { className: "border-0 min-h-18 sticky top-0 z-50 justify-center gap-6 px-4 shadow-md", children: [_jsx(MenubarMenu, { children: _jsx(MenubarTrigger, { asChild: true, className: 'px-14 hover:bg-indigo-600', children: _jsx(Link, { to: "/Game", children: "Start Game" }) }) }), _jsx(MenubarMenu, { children: _jsx(MenubarTrigger, { asChild: true, className: 'px-14 hover:bg-indigo-600', children: _jsx(Link, { to: "/LeaderBoard", children: "Leaderboard" }) }) })] }), _jsx(Outlet, {})] }));
}
