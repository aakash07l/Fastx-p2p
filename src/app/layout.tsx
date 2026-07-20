import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FastX P2P — Buy & Sell Crypto Instantly',
  description:
    'The fastest, most secure P2P crypto exchange platform. Buy and sell Bitcoin, Ethereum, USDT and more with INR instantly.',
  keywords: ['P2P exchange', 'crypto', 'bitcoin', 'USDT', 'INR', 'buy crypto', 'sell crypto'],
  openGraph: {
    title: 'FastX P2P',
    description: 'Buy & Sell Crypto Instantly',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
