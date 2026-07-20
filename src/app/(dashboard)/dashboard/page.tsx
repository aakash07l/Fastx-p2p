'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  ArrowDownToLine, ArrowUpFromLine, BadgeDollarSign, ChevronRight,
  Headphones, Info, WalletCards,
} from 'lucide-react';

const SELL_RATE = 97.66;

export default function DashboardPage() {
  const { getAccessToken } = usePrivy();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch('/api/wallet', { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (data.success) setBalance(Number(data.data?.wallet?.usdtBalance || 0));
      } catch { /* The zero-state is intentionally useful before a wallet is funded. */ }
    };
    load();
  }, [getAccessToken]);

  return (
    <div className="animate-slide-up pb-24">
      <div className="mx-auto mb-12 flex w-fit items-center gap-3 rounded-full border border-[#d7d1ff] bg-white px-4 py-2 shadow-[0_2px_5px_rgba(80,64,200,.08)]">
        <span className="h-4 w-4 rounded-full bg-[#5547f1] shadow-[0_0_0_4px_#e7f0ff]" />
        <span className="text-[17px] font-medium text-[#47414f]">Sell Price</span>
        <strong className="ml-8 text-[17px]">₹{SELL_RATE.toFixed(2)}</strong>
        <Info size={18} className="text-[#125fe8]" />
      </div>

      <section className="text-center">
        <p className="text-[21px] font-medium text-[#504a56]">Available Balance</p>
        <h1 className="mt-3 text-[54px] font-extrabold leading-none tracking-[-.06em] text-[#17161b]">${balance.toFixed(2)}</h1>
        <p className="mt-5 text-[24px] text-[#514c58]">≈ ₹{(balance * SELL_RATE).toFixed(2)}</p>
      </section>

      <section className="mt-11 grid grid-cols-4 gap-3">
        {[
          { label: 'Wallet', href: '/wallet', icon: WalletCards },
          { label: 'Deposit', href: '/wallet?tab=deposit', icon: ArrowDownToLine },
          { label: 'Withdraw', href: '/wallet?tab=withdraw', icon: ArrowUpFromLine },
          { label: 'Support', href: '/help', icon: Headphones },
        ].map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href} className="group flex flex-col items-center gap-3 text-center">
            <span className="flex h-[76px] w-[76px] items-center justify-center rounded-[20px] border border-[#6c5ae8] bg-white text-[#125fe8] transition group-hover:-translate-y-0.5 group-hover:bg-[#f6f9ff]">
              <Icon size={31} strokeWidth={1.7} />
            </span>
            <span className="text-[16px] font-medium text-[#312d36]">{label}</span>
          </Link>
        ))}
      </section>

      <section className="relative mt-11 overflow-hidden rounded-[22px] bg-[linear-gradient(118deg,#181fbb_0%,#1826cb_52%,#334de7_100%)] px-7 py-6 text-white shadow-[0_10px_20px_rgba(46,56,201,.17)]">
        <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[18px] border-white/10" />
        <div className="absolute bottom-[-42px] right-14 h-32 w-32 rounded-full border-[14px] border-white/10" />
        <p className="relative text-[20px] font-bold tracking-[-.04em]">coins<span className="text-[#a99dff]">.me</span></p>
        <p className="relative mt-4 max-w-[180px] text-[19px] font-medium leading-7 text-[#bcc5ff]">Same Wallet Bitcoin SIPs. Buy Gold & Stocks.</p>
        <span className="relative mt-4 inline-flex items-center gap-3 rounded-xl border-2 border-white px-4 py-2 text-[19px] font-semibold">Try now <ChevronRight size={25}/></span>
      </section>
      <div className="my-5 flex justify-center gap-3"><i className="h-2 w-7 rounded-full bg-[#5644ef]"/><i className="h-2 w-3 rounded-full bg-[#a497ff]"/><i className="h-2 w-7 rounded-full bg-[#e5e1ff]"/><i className="h-2 w-7 rounded-full bg-[#e5e1ff]"/></div>

      <section className="rounded-[23px] bg-[#f6f9ff] p-7 shadow-[0_2px_5px_rgba(40,29,111,.08)]">
        <h2 className="text-[23px] font-bold tracking-[-.04em]">Per Transaction Limits</h2>
        <p className="mt-2 max-w-[390px] text-[18px] leading-7 text-[#514c58]">This is the maximum USDT you can buy, sell, or pay in one order. Increase it to do larger transactions.</p>
        <div className="mt-8 grid grid-cols-2 gap-5">
          <LimitAmount label="Buy" value="$0" />
          <LimitAmount label="Sell/Pay" value="$100" />
        </div>
        <Link href="/limits" className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-[#4e45c3] py-3 text-[17px] font-semibold text-[#5145d5] transition hover:bg-white">Increase Transaction Limits</Link>
      </section>

      <section className="mt-11 rounded-[23px] bg-[#f6f5fb] p-7 shadow-[0_2px_5px_rgba(40,29,111,.08)]">
        <h2 className="text-[23px] font-bold tracking-[-.04em]">Refer & Earn</h2>
        <p className="mt-3 text-[18px] leading-7 text-[#514c58]">Earn 0.5% on every trade your friends make. Invite people you trust & start earning today!</p>
        <div className="mt-7 rounded-[20px] bg-[#e7e2ff] p-7">
          <p className="text-[17px] leading-7">You&apos;re just 150 away from reaching your 150 limit to unlock Refer & Earn!</p>
          <p className="mt-5 text-[16px]">0% Done</p>
          <div className="mt-2 h-6 rounded-full bg-white" />
        </div>
        <Link href="/referrals" className="mt-6 flex items-center gap-2 text-[17px] font-semibold text-[#125fe8]">Invite friends <ChevronRight size={21}/></Link>
      </section>
    </div>
  );
}

function LimitAmount({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white text-[#125fe8]"><BadgeDollarSign size={33} strokeWidth={1.8}/></span>
      <span><small className="block text-[17px] font-medium">{label}</small><strong className="block text-[43px] leading-none tracking-[-.06em] text-[#3a86ff]">{value}</strong></span>
    </div>
  );
}
