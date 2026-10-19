export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 bg-gradient-to-b from-[#1d1d2c] via-[#161625] to-[#121220]"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 text-xs sm:text-sm font-semibold text-[#f4a261]">
          <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse"></span>
          <span>Portland's Premier Fitness Studio</span>
        </div>

        {/* Hero Title - mobile-first scaling */}
        <h1
          id="hero-heading"
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 sm:mb-6"
        >
          Push Your Limits.<br />
          <span className="text-[#f4a261]">Find Your Strength.</span>
        </h1>

        {/* Hero Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-[#9a9ab0] mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          Group classes, personal training, and a community that keeps you moving.
          No commitments, expert coaches, and real results.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#classes"
            className="w-full sm:w-auto inline-block bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 rounded-md shadow-lg shadow-red-900/30 transition duration-200"
          >
            Explore Schedule
          </a>
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-block bg-transparent hover:bg-[#f4a261] text-[#f4a261] hover:text-[#1d1d2c] border-2 border-[#f4a261] font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 rounded-md transition duration-200"
          >
            View Membership Plans
          </a>
        </div>
      </div>
    </section>
  );
}
