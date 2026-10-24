'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();

  const navLinks = [
    { label: 'Classes', href: '#classes' },
    { label: 'Trainers', href: '#trainers' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1d1d2c]/95 backdrop-blur-md border-b border-[#3a3a50]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#top" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Pulse<span className="text-[#e63946]">Fit</span></span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden sm:inline-block">
              Live API
            </span>
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

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-[#3a3a50]">
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[10px] text-[#9a9ab0] truncate max-w-[130px]">{user.email}</div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-semibold bg-[#27273a] hover:bg-[#3a3a50] text-[#eaeaf0] hover:text-white px-3 py-1.5 rounded-md border border-[#3a3a50] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-xs sm:text-sm font-semibold text-[#eaeaf0] hover:text-[#e63946] px-3 py-2 transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="text-xs sm:text-sm font-semibold bg-[#e63946] hover:bg-[#b52d38] text-white px-4 py-2 rounded-md transition-colors shadow-sm"
                >
                  Join Now
                </button>
              </div>
            )}
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

            <div className="pt-3 border-t border-[#3a3a50]/60">
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="text-xs text-[#9a9ab0]">
                    Signed in as <strong className="text-white">{user.name}</strong> ({user.email})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-center font-semibold bg-[#27273a] hover:bg-[#3a3a50] text-white px-4 py-2 rounded-md transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('signin');
                      setMenuOpen(false);
                    }}
                    className="w-full text-center font-semibold bg-[#27273a] hover:bg-[#3a3a50] text-[#eaeaf0] px-4 py-2 rounded-md transition-colors text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('signup');
                      setMenuOpen(false);
                    }}
                    className="w-full text-center font-semibold bg-[#e63946] hover:bg-[#b52d38] text-white px-4 py-2 rounded-md transition-colors text-sm"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
