import { div } from "framer-motion/client";
import { ArrowDown } from "lucide-react";

function ScrollToMain() {

    return (
        <button
            onClick={() =>
                document.getElementById("main")?.scrollIntoView({ behavior: "smooth" })
            }
            className="
        z-50
        rounded-full bg-gray-800 p-6
        text-white shadow-lg
        hover:bg-indigo-600
        transition
        animate-bounce
      "
        >
            <ArrowDown className="h-5 w-5" />
        </button>
    );
}


export default ScrollToMain