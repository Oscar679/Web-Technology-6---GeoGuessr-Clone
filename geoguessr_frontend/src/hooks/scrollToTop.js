import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 250);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    if (!visible)
        return null;
    return (_jsx("button", { onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), className: "\n        fixed bottom-6 right-6 z-50\n        rounded-full bg-indigo-600 p-3\n        text-white shadow-lg\n        hover:bg-indigo-500\n        transition\n      ", children: _jsx(ArrowUp, { className: "h-5 w-5" }) }));
}
export default ScrollToTop;
