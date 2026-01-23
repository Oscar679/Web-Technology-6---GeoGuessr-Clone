import { jsx as _jsx } from "react/jsx-runtime";
import { ArrowDown } from "lucide-react";
function ScrollToMain() {
    return (_jsx("button", { onClick: () => document.getElementById("main")?.scrollIntoView({ behavior: "smooth" }), className: "\r\n        z-50\r\n        rounded-full bg-gray-800 p-6\r\n        text-white shadow-lg\r\n        hover:bg-indigo-600\r\n        transition\r\n        animate-bounce\r\n      ", children: _jsx(ArrowDown, { className: "h-5 w-5" }) }));
}
export default ScrollToMain;
