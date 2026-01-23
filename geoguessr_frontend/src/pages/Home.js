import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import ScrollToTop from "../hooks/scrollToTop";
import ScrollToMain from "../hooks/scrollToMain";
import HomeGuide from "../components/HomeGuide";
import GlobeHero from "../components/ui/GlobeHero";
export default function Home() {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative min-h-screen overflow-x-hidden mask-b-from-70%", children: [_jsx("div", { className: "absolute inset-0", children: _jsx(GlobeHero, {}) }), _jsxs("div", { className: "absolute top-40 z-10 w-full px-10 pb-8 text-white", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Guess the Location" }), _jsx("p", { className: "text-2xl opacity-80 max-w-xl", children: "Explore the planet. Challenge your friends today." })] }), _jsx("div", { className: "absolute bottom-40 left-1/2 -translate-x-1/2 z-10", children: _jsx(ScrollToMain, {}) })] }), _jsxs("main", { className: "min-h-screen mx-auto max-w-[1000px] px-32 scroll-mt-[100px] mt-20", id: "main", children: [_jsx("div", { className: "absolute left-1/2 -translate-x-1/2" }), _jsx(HomeGuide, {})] }), _jsx(ScrollToTop, {})] }));
}
