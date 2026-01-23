import ScrollToTop from "../hooks/scrollToTop"
import ScrollToMain from "../hooks/scrollToMain"
import HomeGuide from "../components/HomeGuide"
import GlobeHero from "../components/ui/GlobeHero"

export default function Home() {
    return (
        <>
            <div className="relative min-h-screen overflow-x-hidden mask-b-from-70%">
                <div className="absolute inset-0">
                    <GlobeHero />
                </div>
                <div className="absolute top-40 z-10 w-full px-10 pb-8 text-white">
                    <h1 className="text-2xl font-bold mb-6">Guess the Location</h1>
                    <p className="text-2xl opacity-80 max-w-xl">Explore the planet. Challenge your friends today.</p>
                </div>
                <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10">

                    <ScrollToMain />
                </div>
            </div>
            <main
                className="min-h-screen mx-auto max-w-[1000px] px-32 scroll-mt-[100px] mt-20"
                id="main">
                <div className="absolute left-1/2 -translate-x-1/2"></div>
                <HomeGuide />
            </main>
            <ScrollToTop />
        </>
    )
}