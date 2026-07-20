'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import {
  ArrowLeft, ArrowRight, BadgeDollarSign, CircleHelp, Coins, Download,
  Headphones, Menu, ReceiptText, Settings, SlidersHorizontal, WalletCards,
  LogOut, ScanLine, ChevronRight,
} from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/buy': 'Buy USDT',
  '/sell': 'Sell USDT',
  '/wallet': 'Wallet',
  '/transactions': 'Transactions',
  '/referrals': 'Refer & Earn',
  '/limits': 'My Limits',
  '/help': 'Help & Support',
  '/settings': 'Settings',
};

const MENU_ITEMS = [
  { href: '/limits', label: 'My Limits', icon: BadgeDollarSign },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/referrals', label: 'Refer & Earn', icon: Coins },
  { href: '/help', label: 'Help & Support', icon: Headphones },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function Logo() {
  return (
    <span className="flex items-center gap-2 text-[25px] leading-none font-extrabold tracking-[-0.05em] text-[#16151b]">
      <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-gradient-to-br from-[#3f42e8] to-[#7557ff] text-white shadow-[0_3px_10px_rgba(79,65,239,.3)]">
        <ScanLine size={18} strokeWidth={2.5} />
      </span>
      FASTX <span className="text-[#125fe8]">P2P</span>
    </span>
  );
}

function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="app-header">
      <button onClick={onMenu} aria-label="Open menu" className="icon-button">
        <Menu size={22} />
      </button>
      <Link href="/dashboard" aria-label="FastX P2P home"><Logo /></Link>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111] text-[11px] font-bold leading-[10px] text-white">
          <span>coins<br/><i className="not-italic text-[#9c83ff]">.me</i></span>
        </div>
        <button aria-label="Download app" className="flex h-12 w-14 items-center justify-center rounded-2xl bg-[#111] text-white">
          <Download size={20} />
        </button>
      </div>
    </header>
  );
}

function PageHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <header className="app-header app-subheader">
      <button onClick={() => router.back()} aria-label="Go back" className="icon-button">
        <ArrowLeft size={22} />
      </button>
      <h1 className="ml-2 text-[24px] font-bold tracking-[-0.04em] text-[#17161c]">{title}</h1>
      <Link href="/help" aria-label="Help" className="icon-button ml-auto"><CircleHelp size={22} /></Link>
    </header>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDashboard = pathname === '/dashboard';
  const title = Object.entries(PAGE_TITLES).find(([href]) => pathname.startsWith(href))?.[1] || 'FastX P2P';
  const name = user?.email?.address?.split('@')[0] || user?.google?.name || 'FastX member';

  return (
    <>
      {isDashboard ? <DashboardHeader onMenu={() => setMenuOpen(true)} /> : <PageHeader title={title} />}

      {menuOpen && (
        <div className="fixed inset-0 z-[80]">
          <button className="absolute inset-0 w-full cursor-default bg-black/45" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(85vw,430px)] flex-col bg-white shadow-2xl animate-[drawerIn_.22s_ease-out]">
            <div className="flex h-[88px] items-center gap-3 border-b border-[#e8e6ed] px-6">
              <Logo />
              <button onClick={() => setMenuOpen(false)} className="ml-auto rounded-full p-2 text-[#125fe8] hover:bg-[#f2f0ff]" aria-label="Close menu"><ArrowLeft size={29}/></button>
            </div>
            <nav className="px-6 pt-4">
              {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="drawer-item">
                  <Icon size={26} strokeWidth={1.8} className="text-[#125fe8]" />
                  <span>{label}</span><ArrowRight className="ml-auto" size={31} strokeWidth={1.8} />
                </Link>
              ))}
              <div className="drawer-item mt-1">
                <SlidersHorizontal size={25} strokeWidth={1.8} className="text-[#125fe8]" />
                <span>Connection Status</span><span className="ml-auto h-5 w-5 rounded-full border-2 border-white bg-emerald-400 shadow-[0_1px_4px_rgba(16,185,129,.7)]" />
              </div>
            </nav>
            <div className="mt-auto space-y-5 border-t border-[#e8e6ed] px-6 py-6">
              <Link href="/wallet" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 rounded-[22px] bg-[#edf5ff] p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#125fe8]"><WalletCards size={23}/></span>
                <span className="font-semibold"><strong className="block">FastX Wallet</strong><small className="font-normal text-[#55515e]">Send · Receive · Swap</small></span>
                <ChevronRight className="ml-auto text-[#125fe8]" />
              </Link>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ebe9ed] text-xs font-bold text-[#55515e]">{name.slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 flex-1 text-sm"><strong className="block truncate">Logged in as</strong><small className="block truncate text-[#686372]">{user?.email?.address || name}</small></span>
                <button onClick={() => logout()} className="rounded-xl p-2 text-[#125fe8] hover:bg-[#f2f0ff]" aria-label="Sign out"><LogOut size={22}/></button>
              </div>
              <p className="text-center text-xs text-[#7b7584]">FastX P2P · Terms & Conditions</p>
            </div>
          </aside>
        </div>
      )}

      {isDashboard && <TradeDock />}
    </>
  );
}

function TradeDock() {
  return (
    <div className="trade-dock">
      <div className="mx-auto flex max-w-[560px] items-end justify-between gap-3 px-4">
        <Link href="/buy" className="dock-trade dock-buy"><WalletCards size={18}/> Buy USDT</Link>
        <Link href="/wallet?tab=deposit" className="relative -top-8 flex w-24 flex-col items-center text-center text-sm font-medium text-[#2c2934]">
          <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[8px] border-white bg-[#faf9ff] text-[#125fe8] shadow-[0_4px_19px_rgba(67,45,198,.18)]"><ScanLine size={38}/></span>
          <span className="mt-1 whitespace-nowrap">Scan & Pay</span>
        </Link>
        <Link href="/sell" className="dock-trade dock-sell"><WalletCards size={18}/> Sell USDT</Link>
      </div>
    </div>
  );
}
