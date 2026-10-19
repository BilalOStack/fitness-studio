import { useState } from 'react';
import { CATEGORIES, CLASSES, TRAINERS, PRICING_PLANS, STUDIO_INFO } from '../data';
import QuantityStepper from './QuantityStepper';

export default function MainContent() {
  // Real filter on main grid with useState
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Controlled component state: map of classId -> reserved spots
  const [spotsMap, setSpotsMap] = useState({});

  // Booking toast notification
  const [bookingNotice, setBookingNotice] = useState(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Filtered classes derived state
  const filteredClasses = selectedCategory === 'All'
    ? CLASSES
    : CLASSES.filter((cls) => cls.category === selectedCategory);

  const handleIncrement = (classId, max) => {
    setSpotsMap((prev) => ({
      ...prev,
      [classId]: Math.min(max, (prev[classId] || 1) + 1),
    }));
  };

  const handleDecrement = (classId) => {
    setSpotsMap((prev) => ({
      ...prev,
      [classId]: Math.max(1, (prev[classId] || 1) - 1),
    }));
  };

  const handleBookClass = (classItem) => {
    const qty = spotsMap[classItem.id] || 1;
    const msg = `Reserved ${qty} spot${qty > 1 ? 's' : ''} for "${classItem.title}" on ${classItem.days.join(', ')} at ${classItem.time}!`;
    setBookingNotice(msg);
    setTimeout(() => {
      setBookingNotice(null);
    }, 4000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
  };

  return (
    <main className="w-full">
      {/* Toast Notice */}
      {bookingNotice && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#27273a] border-l-4 border-[#2a9d8f] text-white px-4 py-3 rounded-md shadow-xl text-sm flex items-center gap-3 animate-fade-in max-w-sm">
          <span>✓</span>
          <span>{bookingNotice}</span>
          <button
            type="button"
            onClick={() => setBookingNotice(null)}
            className="ml-auto text-[#9a9ab0] hover:text-white"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================
          1. CLASS SCHEDULE SECTION (Filtered Grid + QuantityStepper)
          ============================================================ */}
      <section id="classes" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" aria-labelledby="classes-heading">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e63946]">
            Weekly Timetable
          </span>
          <h2
            id="classes-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 relative pb-3 after:content-[''] after:block after:w-14 after:h-0.5 after:bg-[#e63946] after:mx-auto after:mt-2"
          >
            Weekly Class Schedule
          </h2>
          <p className="text-sm sm:text-base text-[#9a9ab0] mt-3 max-w-xl mx-auto">
            Choose your workout style and reserve your spot in advance. Spots are limited per session.
          </p>
        </div>

        {/* Real Category Filter Bar (useState) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12" role="group" aria-label="Filter classes by category">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = category === 'All'
              ? CLASSES.length
              : CLASSES.filter((c) => c.category === category).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#e63946] text-white border-[#e63946] shadow-md shadow-red-900/30'
                    : 'bg-[#1d1d2c] text-[#eaeaf0] border-[#3a3a50] hover:border-[#9a9ab0] hover:bg-[#27273a]'
                }`}
              >
                <span>{category}</span>
                <span className="ml-1.5 text-xs opacity-70 font-normal">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: mobile-first (1 col -> 2 cols sm -> 3 cols lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((item) => {
            const currentQty = spotsMap[item.id] || 1;

            return (
              <article
                key={item.id}
                className="bg-[#27273a] border border-[#3a3a50] rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#f4a261]/50 hover:-translate-y-1 transition duration-200 shadow-lg"
              >
                <div>
                  {/* Top Bar: Category badge & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#9a9ab0]">
                      {item.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                    {item.title}
                  </h3>

                  {/* Trainer & Time */}
                  <div className="space-y-1 text-xs sm:text-sm text-[#9a9ab0] mb-3">
                    <p className="flex items-center gap-1.5 text-white/90">
                      <span>Coach:</span>
                      <strong className="text-[#f4a261]">{item.trainer}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>Time:</span>
                      <span className="text-white font-medium">{item.time}</span>
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.days.map((day) => (
                        <span key={day} className="px-1.5 py-0.5 rounded bg-[#1d1d2c] text-xs text-[#eaeaf0]">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#9a9ab0] mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Controlled Component: QuantityStepper reused per item */}
                <div className="pt-4 border-t border-[#3a3a50] space-y-3">
                  <QuantityStepper
                    value={currentQty}
                    onIncrement={() => handleIncrement(item.id, item.spotsAvailable)}
                    onDecrement={() => handleDecrement(item.id)}
                    min={1}
                    max={item.spotsAvailable}
                    label="Spots"
                  />

                  <div className="flex items-center justify-between text-xs text-[#9a9ab0]">
                    <span>Available:</span>
                    <span className="text-teal-400 font-medium">
                      {item.spotsAvailable} spots left
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookClass(item)}
                    className="w-full bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors shadow-sm"
                  >
                    Reserve {currentQty} {currentQty === 1 ? 'Spot' : 'Spots'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          2. TRAINERS SECTION (Flex/Grid cards from array)
          ============================================================ */}
      <section id="trainers" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#161626]/50 rounded-2xl my-8" aria-labelledby="trainers-heading">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e63946]">
            Elite Coaching
          </span>
          <h2
            id="trainers-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 relative pb-3 after:content-[''] after:block after:w-14 after:h-0.5 after:bg-[#e63946] after:mx-auto after:mt-2"
          >
            Meet Our Trainers
          </h2>
          <p className="text-sm sm:text-base text-[#9a9ab0] mt-3 max-w-xl mx-auto">
            Experienced, certified trainers passionate about guiding you toward your goals.
          </p>
        </div>

        {/* Responsive grid mobile-first */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINERS.map((trainer) => (
            <article
              key={trainer.id}
              className="bg-[#27273a] border border-[#3a3a50] rounded-xl p-6 text-center flex flex-col items-center hover:-translate-y-1 hover:border-[#f4a261]/50 transition duration-200"
            >
              <div className="w-16 h-16 rounded-full bg-[#1d1d2c] flex items-center justify-center text-3xl mb-4 shadow-inner" aria-hidden="true">
                {trainer.avatar}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {trainer.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#f4a261] mb-3">
                {trainer.specialty}
              </p>
              <p className="text-xs sm:text-sm text-[#9a9ab0] leading-relaxed">
                {trainer.bio}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================
          3. PRICING SECTION (Pricing cards with featured highlight)
          ============================================================ */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" aria-labelledby="pricing-heading">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e63946]">
            Transparent Value
          </span>
          <h2
            id="pricing-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 relative pb-3 after:content-[''] after:block after:w-14 after:h-0.5 after:bg-[#e63946] after:mx-auto after:mt-2"
          >
            Membership Plans
          </h2>
          <p className="text-sm sm:text-base text-[#9a9ab0] mt-3 max-w-xl mx-auto">
            Simple tiers. No initiation fees. Cancel or change your plan at any time.
          </p>
        </div>

        {/* Responsive grid mobile-first */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative bg-[#27273a] rounded-xl p-6 sm:p-8 flex flex-col text-center border transition duration-200 ${
                plan.featured
                  ? 'border-[#e63946] ring-2 ring-[#e63946] sm:scale-105 z-10 shadow-xl'
                  : 'border-[#3a3a50] hover:border-[#9a9ab0]'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#e63946] text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-xl font-bold text-white mb-2 mt-2">
                {plan.name}
              </h3>

              <div className="my-4">
                <span className="text-2xl font-semibold text-white align-top">$</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-sm text-[#9a9ab0] ml-1">{plan.period}</span>
              </div>

              <ul className="text-left space-y-2.5 my-6 flex-grow text-xs sm:text-sm text-[#eaeaf0]">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#f4a261] font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-2.5 px-4 rounded-md font-semibold text-sm transition duration-200 ${
                  plan.featured
                    ? 'bg-[#e63946] hover:bg-[#b52d38] text-white shadow-md'
                    : 'border-2 border-[#f4a261] text-[#f4a261] hover:bg-[#f4a261] hover:text-[#1d1d2c]'
                }`}
              >
                {plan.buttonText}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================
          4. CONTACT SECTION (Two-column CSS grid mobile-first)
          ============================================================ */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" aria-labelledby="contact-heading">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e63946]">
            Connect
          </span>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 relative pb-3 after:content-[''] after:block after:w-14 after:h-0.5 after:bg-[#e63946] after:mx-auto after:mt-2"
          >
            Get in Touch
          </h2>
          <p className="text-sm sm:text-base text-[#9a9ab0] mt-3 max-w-xl mx-auto">
            Questions about classes, memberships, or personal training? Reach out anytime.
          </p>
        </div>

        {/* Two-column grid mobile-first: stack on mobile, 2 columns on md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-[#27273a] border border-[#3a3a50] rounded-xl p-6 sm:p-8 md:p-10">
          {/* Left Column: Info */}
          <div className="space-y-6 text-sm sm:text-base text-[#9a9ab0]">
            <div>
              <strong className="block text-white text-base sm:text-lg mb-1">Studio Address</strong>
              <p>{STUDIO_INFO.address}</p>
            </div>

            <div>
              <strong className="block text-white text-base sm:text-lg mb-1">Hours</strong>
              <p>{STUDIO_INFO.hours.weekdays}</p>
              <p>{STUDIO_INFO.hours.weekend}</p>
            </div>

            <div>
              <strong className="block text-white text-base sm:text-lg mb-1">Direct Phone</strong>
              <p>
                <a href={STUDIO_INFO.phoneHref} className="text-[#f4a261] hover:underline">
                  {STUDIO_INFO.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Controlled Form */}
          <div>
            {contactSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#1d1d2c] rounded-lg border border-[#3a3a50]">
                <span className="text-4xl mb-3">✓</span>
                <h3 className="text-lg font-bold text-white mb-1">Message Received!</h3>
                <p className="text-sm text-[#9a9ab0] mb-4">
                  Thanks, {contactForm.name}. A coach will be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactForm({ name: '', email: '', message: '' });
                  }}
                  className="text-xs font-semibold text-[#f4a261] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4" aria-label="Contact form">
                <div>
                  <label htmlFor="cf-name" className="block text-xs font-semibold uppercase tracking-wider text-[#eaeaf0] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="cf-name"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#1d1d2c] border border-[#3a3a50] text-white text-sm focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="cf-email" className="block text-xs font-semibold uppercase tracking-wider text-[#eaeaf0] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="cf-email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#1d1d2c] border border-[#3a3a50] text-white text-sm focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="cf-message" className="block text-xs font-semibold uppercase tracking-wider text-[#eaeaf0] mb-1">
                    Message
                  </label>
                  <textarea
                    id="cf-message"
                    rows="3"
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#1d1d2c] border border-[#3a3a50] text-white text-sm focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] transition"
                    placeholder="Questions or class inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold py-2.5 px-4 rounded-md text-sm transition duration-200"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
