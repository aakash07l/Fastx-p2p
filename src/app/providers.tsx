'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ThirdwebProvider } from 'thirdweb/react';
import { ThemeProvider } from 'next-themes';
import { privyConfig } from '@/lib/privy/config';

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <main className="flex min-h-screen items-center justify-center bg-[#f7fbff] px-6 text-center">
          <section className="max-w-md rounded-[26px] border border-[#dce8fa] bg-white p-8 shadow-[0_12px_35px_rgba(14,89,208,.1)]">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#125fe8]">FastX P2P</p>
            <h1 className="mt-3 text-2xl font-bold text-[#172033]">Privy is not configured</h1>
            <p className="mt-3 leading-6 text-[#606b7e]">Add <code className="rounded bg-[#edf5ff] px-1.5 py-0.5 text-[#125fe8]">NEXT_PUBLIC_PRIVY_APP_ID</code> in Vercel, then redeploy. Keep the matching <code className="rounded bg-[#edf5ff] px-1.5 py-0.5 text-[#125fe8]">PRIVY_APP_SECRET</code> server-only.</p>
          </section>
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <PrivyProvider
        appId={appId}
        config={privyConfig}
      >
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}
