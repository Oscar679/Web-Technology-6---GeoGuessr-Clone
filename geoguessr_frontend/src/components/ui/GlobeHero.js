import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Globe from "react-globe.gl";
import { useMemo, useState } from "react";
export default function GlobeHero() {
    const [rise] = useState(false);
    const N_PATHS = 40;
    const MAX_POINTS_PER_LINE = 1000;
    const MAX_STEP_DEG = 1;
    const MAX_STEP_ALT = 0.015;
    const gData = useMemo(() => [...Array(N_PATHS)].map(() => {
        let lat = (Math.random() - 0.5) * 90;
        let lng = (Math.random() - 0.5) * 360;
        let alt = 0;
        return [
            [lat, lng, alt],
            ...[...Array(Math.round(Math.random() * MAX_POINTS_PER_LINE))].map(() => {
                lat += (Math.random() * 2 - 1) * MAX_STEP_DEG;
                lng += (Math.random() * 2 - 1) * MAX_STEP_DEG;
                alt += (Math.random() * 2 - 1) * MAX_STEP_ALT;
                alt = Math.max(0, alt);
                return [lat, lng, alt];
            }),
        ];
    }), []);
    return (_jsxs("section", { className: "relative h-[80vh]", onWheelCapture: (e) => e.stopPropagation(), children: [_jsx(Globe, { globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg", bumpImageUrl: "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png", pathsData: gData, pathColor: () => [
                    'rgba(79,70,229,0.75)', // indigo-600
                    'rgba(147,197,253,0.6)' // blue-300
                ], pathDashLength: 0.01, pathDashGap: 0.004, pathDashAnimateTime: 100000, pathPointAlt: rise ? pnt => pnt[2] : undefined, pathTransitionDuration: rise ? 4000 : undefined, backgroundColor: "#0B1020", atmosphereColor: "#4F46E5", atmosphereAltitude: 0.12 }), _jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none" })] }));
}
