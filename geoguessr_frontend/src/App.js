import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Layout from "./Layout";
import LeaderBoard from "./pages/LeaderBoard";
function App() {
    return (_jsx(_Fragment, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "/Home", element: _jsx(Home, {}) }), _jsx(Route, { path: "/Game", element: _jsx(Game, {}) }), _jsx(Route, { path: "/Result", element: _jsx(Result, {}) }), _jsx(Route, { path: "/Leaderboard", element: _jsx(LeaderBoard, {}) })] }) }) }));
}
export default App;
