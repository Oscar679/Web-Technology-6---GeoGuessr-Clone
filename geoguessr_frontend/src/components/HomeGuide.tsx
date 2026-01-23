import {
    motion
} from "framer-motion"

const timeline = [
    {
        title: "Create an Account",
        description:
            "Complete a simple & free sign-up process to create your personalized account.",
    },
    {
        title: "Start a Game",
        description:
            "Simply click 'Start Game' to begin your exciting geography challenge.",
    },
    {
        title: "Compete with Friends",
        description:
            "Invite friends and see who can guess locations most accurately.",
    },
    {
        title: "Leaderboards",
        description:
            "Leaderboards showcase top players, fostering competition and community engagement.",
    }
];


function ProjectTimeline() {
    return (
        <section className="relative mx-auto max-w-[900px] py-20">
            {/* Center line (desktop only) */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/40 md:block" />

            <div className="space-y-16">
                {timeline.map((item, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: isLeft ? -40 : 40,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}

                            viewport={{
                                once: true,
                                amount: 0.3,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                            className={`
      relative flex
      flex-col md:flex-row
      ${isLeft ? "md:justify-start" : "md:justify-end"}
    `}
                        >
                            {/* Card */}
                            <div
                                className={`
              w-full md:w-[45%]
              bg-[#191919] border border-white/20
              rounded-lg p-10
            `}
                            >
                                <h3 className="text-lg font-semibold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-white/70">
                                    {item.description}
                                </p>
                            </div>

                            {/* Dot */}
                            <div
                                className="
              absolute left-1/2 top-6 hidden
              -translate-x-1/2
              md:block
              h-3 w-3 rounded-full bg-indigo-600
            "
                            />
                        </motion.div>
                    );
                })}
            </div>
        </section>

    );
}

export default ProjectTimeline