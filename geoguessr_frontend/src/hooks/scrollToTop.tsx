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

  if (!visible) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      className="
        fixed bottom-6 right-6 z-50
        rounded-full bg-indigo-600 p-3
        text-white shadow-lg
        hover:bg-indigo-500
        transition
      "
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}


export default ScrollToTop