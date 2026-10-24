'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (authModalTab === 'signin') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail('member@pulsefit.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#1d1d2c] border border-[#3a3a50] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-[#eaeaf0]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#9a9ab0] hover:text-white p-2 rounded-lg hover:bg-[#27273a] transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Tab switch */}
        <div className="flex border-b border-[#3a3a50] mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('signin');
              setError(null);
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
              authModalTab === 'signin'
                ? 'border-[#e63946] text-[#e63946]'
                : 'border-transparent text-[#9a9ab0] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('signup');
              setError(null);
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
              authModalTab === 'signup'
                ? 'border-[#e63946] text-[#e63946]'
                : 'border-transparent text-[#9a9ab0] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <h3 id="auth-modal-title" className="text-xl font-bold text-white mb-2">
          {authModalTab === 'signin' ? 'Welcome Back' : 'Join PulseFit'}
        </h3>
        <p className="text-xs text-[#9a9ab0] mb-6">
          {authModalTab === 'signin'
            ? 'Sign in to manage and book your workout sessions.'
            : 'Register for free and reserve your spot in live fitness classes.'}
        </p>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#eaeaf0] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#27273a] border border-[#3a3a50] text-white text-sm focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#eaeaf0] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#27273a] border border-[#3a3a50] text-white text-sm focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#eaeaf0] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#27273a] border border-[#3a3a50] text-white text-sm focus:outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition duration-200 disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : authModalTab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {authModalTab === 'signin' && (
          <div className="mt-4 pt-4 border-t border-[#3a3a50]/60 text-center">
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs text-[#f4a261] hover:underline"
            >
              👉 Quick Demo Fill: member@pulsefit.com
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
