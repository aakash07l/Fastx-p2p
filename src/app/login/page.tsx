'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'BRL', symbol: 'R$', flag: '🇧🇷', name: 'Brazilian Real' },
  { code: 'IDR', symbol: 'Rp', flag: '🇮🇩', name: 'Indonesian Rupiah' },
];

export default function LoginPage() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('English');
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/dashboard');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0ff]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef0ff] via-[#f0f0ff] to-[#e8e8f8] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gray-900 tracking-tight">FastX <span className="text-[#125fe8]">P2P</span></h1>
            <p className="text-sm text-gray-500 mt-1">
              Swap USDT ↔ {selectedCurrency.code} instantly
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-black/5 overflow-hidden">
          {/* Illustration area */}
          <div className="bg-gradient-to-b from-indigo-50 to-white pt-8 pb-4 px-8 flex flex-col items-center">
            {/* Exchange illustration */}
            <div className="relative w-48 h-36 flex items-center justify-center mb-2">
              {/* Phone 1 */}
              <div className="absolute left-0 bottom-0 w-20 h-32 bg-white rounded-2xl border-2 border-indigo-200 shadow-lg flex flex-col items-center justify-center gap-1 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">₹</span>
                </div>
                <div className="w-14 h-1.5 bg-indigo-400 rounded-full mt-1" />
                <div className="w-10 h-1 bg-indigo-200 rounded-full" />
              </div>
              {/* Center arrow */}
              <div className="z-10 bg-white border-2 border-indigo-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Phone 2 */}
              <div className="absolute right-0 bottom-0 w-20 h-32 bg-indigo-600 rounded-2xl border-2 border-indigo-700 shadow-lg flex flex-col items-center justify-center gap-1 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div className="w-14 h-1.5 bg-indigo-300 rounded-full mt-1" />
                <div className="w-10 h-1 bg-indigo-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="px-7 pb-7 pt-3 space-y-5">
            {/* Currency & Language selects */}
            <div>
              <p className="text-center text-sm text-gray-500 font-medium mb-4">Select currency and language</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Currency select */}
                <div className="relative">
                  <button
                    id="currency-select"
                    onClick={() => setCurrencyOpen(!currencyOpen)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{selectedCurrency.flag}</span>
                      <span>·</span>
                      <span>{selectedCurrency.symbol}</span>
                      <span>·</span>
                      <span>{selectedCurrency.code}</span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  {currencyOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-left hover:bg-indigo-50 transition-colors ${currency === c.code ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700'}`}
                        >
                          <span>{c.flag}</span>
                          <span>{c.code}</span>
                          <span className="text-gray-400 text-xs">· {c.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language select */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  <span>{language}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-auto"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400">
              By logging in, you agree to our{' '}
              <a href="#" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">Terms & Conditions</a>
            </p>

            {/* Login button */}
            <button
              id="login-button"
              onClick={() => login()}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-base tracking-wide transition-all shadow-lg shadow-indigo-200"
            >
              Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secured by Privy · Zero bank freeze risk
        </p>
      </div>
    </div>
  );
}
