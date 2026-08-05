export default function Hero3D() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-blue-950/20 dark:via-black dark:to-black" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Floating PDF cards — minimal, elegant */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Card 1 — left */}
        <div className="hero-float absolute opacity-[0.07] dark:opacity-[0.05]" style={{ left: '10%', top: '25%' }}>
          <div className="w-28 h-36 md:w-36 md:h-44 bg-neutral-900 dark:bg-white rounded-2xl transform -rotate-12" />
        </div>

        {/* Card 2 — center, main */}
        <div className="hero-float absolute opacity-[0.06] dark:opacity-[0.04]" style={{ top: '15%', animationDelay: '1s' }}>
          <div className="w-36 h-44 md:w-44 md:h-56 bg-neutral-900 dark:bg-white rounded-2xl" />
        </div>

        {/* Card 3 — right */}
        <div className="hero-float absolute opacity-[0.07] dark:opacity-[0.05]" style={{ right: '10%', top: '30%', animationDelay: '2s' }}>
          <div className="w-28 h-36 md:w-36 md:h-44 bg-neutral-900 dark:bg-white rounded-2xl transform rotate-12" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
    </div>
  );
}
