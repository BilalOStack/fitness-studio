export default function Hero() {
  const stats = [
    { value: '11+', label: 'Weekly Live Classes' },
    { value: '4', label: 'Certified Elite Coaches' },
    { value: '100%', label: 'Real-Time Spot Tracking' },
    { value: 'Stripe', label: 'Instant Secure Checkout' },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-14 sm:py-20 md:py-24 bg-gradient-to-b from-[#1d1d2c] via-[#161625] to-[#121220]"
      aria-labelledby="hero-heading"
    >
      {/* Decorative Background Glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#e63946]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#f4a261]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Subtle Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 text-xs sm:text-sm font-semibold text-[#f4a261]">
              <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse"></span>
              <span>Portland&apos;s Premier Fitness Studio</span>
            </div>

            {/* Hero Title */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 sm:mb-6"
            >
              Push Your Limits.<br />
              <span className="bg-gradient-to-r from-[#f4a261] via-[#e76f51] to-[#e63946] bg-clip-text text-transparent">
                Find Your Strength.
              </span>
            </h1>

            {/* Hero Paragraph */}
            <p className="text-base sm:text-lg text-[#9a9ab0] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              High-energy group classes, elite personal training, and a community that keeps you moving.
              Reserve live spots or unlock unlimited access in seconds.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#classes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-lg shadow-lg shadow-red-900/30 transition duration-200"
              >
                <span>Explore Schedule</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#27273a]/80 hover:bg-[#f4a261] text-[#f4a261] hover:text-[#1d1d2c] border border-[#f4a261]/60 font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-lg transition duration-200"
              >
                View Membership Plans
              </a>
            </div>
          </div>

          {/* Right Column: Visual Photo Collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#3a3a50] shadow-xl group h-44 sm:h-52">
                <img
                  src="/images/class-strength.jpg"
                  alt="Strength and conditioning training floor"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121220]/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white bg-[#e63946]/90 px-2.5 py-0.5 rounded-full">
                    Strength Lab
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#3a3a50] shadow-xl group h-36 sm:h-44">
                <img
                  src="/images/class-boxing.jpg"
                  alt="Heavy bag boxing and kickboxing workout"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121220]/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white bg-orange-500/90 px-2.5 py-0.5 rounded-full">
                    Kickboxing &amp; Fight Club
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#3a3a50] shadow-xl group h-36 sm:h-44">
                <img
                  src="/images/class-cycle.jpg"
                  alt="Indoor cycling bikes and cardio studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121220]/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white bg-sky-500/90 px-2.5 py-0.5 rounded-full">
                    Spin &amp; Burn
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#3a3a50] shadow-xl group h-44 sm:h-52">
                <img
                  src="/images/class-yoga.jpg"
                  alt="Power yoga and mobility flow studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121220]/90 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white bg-teal-500/90 px-2.5 py-0.5 rounded-full">
                    Mobility &amp; Flow Studio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#3a3a50]/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1d1d2c]/80 border border-[#3a3a50]/80 rounded-xl p-4 text-center"
            >
              <div className="text-xl sm:text-2xl font-extrabold text-[#f4a261]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#9a9ab0] mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
