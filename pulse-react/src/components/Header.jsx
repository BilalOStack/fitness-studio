import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Classes', href: '#classes' },
    { label: 'Trainers', href: '#trainers' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1d1d2c]/95 backdrop-blur-md border-b border-[#3a3a50]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#top" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Pulse<span className="text-[#e63946]">Fit</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm lg:text-base font-medium text-[#eaeaf0] hover:text-[#e63946] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="text-xs sm:text-sm font-semibold bg-[#e63946] hover:bg-[#b52d38] text-white px-4 py-2 rounded-md transition-colors"
            >
              Join Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-[#eaeaf0] hover:text-[#e63946] hover:bg-[#27273a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#e63946]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-[#3a3a50]/60 space-y-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#eaeaf0] hover:text-[#e63946] hover:bg-[#27273a] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center mt-2 font-semibold bg-[#e63946] hover:bg-[#b52d38] text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              Join Now
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
