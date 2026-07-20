'use client';

import { Delete, WalletCards, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AmountKeypadProps {
  amount: string;
  onChange: (value: string) => void;
  limit: string;
  actionLabel: string;
  onContinue: () => void;
  disabled?: boolean;
  balanceNote?: string;
}

export function AmountKeypad({ amount, onChange, limit, actionLabel, onContinue, disabled = false, balanceNote }: AmountKeypadProps) {
  const append = (value: string) => {
    if (value === '.' && amount.includes('.')) return;
    if (amount.length >= 9) return;
    onChange(amount === '0' ? value : `${amount}${value}`);
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <section className="pt-20 text-center">
      <h2 className="text-[64px] font-extrabold leading-none tracking-[-.07em] text-[#a093f6]">{amount || '0'}<span className="ml-2 text-[21px] font-semibold tracking-[-.04em] text-[#4e4954]">USDT</span></h2>
      <p className="mt-8 text-[20px] font-semibold text-[#504b55]">↕ <span className="ml-3">INR</span></p>
      {balanceNote && <p className="mt-7 text-[18px] text-[#504b55]">Available Balance: <strong className="font-semibold text-[#125fe8]">{balanceNote}</strong></p>}
      <Link href="/limits" className="mt-16 flex w-full items-center gap-4 rounded-[18px] bg-[#f0edff] px-7 py-5 text-left text-[18px] text-[#504b55]">
        <WalletCards size={30} className="text-[#125fe8]" strokeWidth={1.6}/>
        <span>Your Transaction Limit: <strong className="text-[#125fe8]">{limit}</strong></span><ChevronRight className="ml-auto text-[#28232c]" size={23}/>
      </Link>
      <div className="mt-9 grid grid-cols-3 gap-y-7 text-[34px] font-medium tracking-[-.04em] text-[#17161b]">
        {keys.map((key) => <button type="button" onClick={() => append(key)} key={key} className="rounded-xl py-1 transition hover:bg-[#f6f9ff] active:scale-95">{key}</button>)}
        <button type="button" onClick={() => onChange(amount.slice(0, -1))} aria-label="Delete last number" className="flex items-center justify-center rounded-xl py-1 transition hover:bg-[#f6f9ff] active:scale-95"><Delete size={31}/></button>
      </div>
      <div className="mt-10 flex justify-between px-[20%] text-[22px] font-medium text-[#125fe8]">
        <button type="button" onClick={() => onChange('999')}>Max</button><button type="button" onClick={() => onChange('')}>Clear</button>
      </div>
      <button type="button" onClick={onContinue} disabled={disabled || !Number(amount)} className="mt-10 w-full rounded-xl bg-[#91bdfb] py-5 text-[19px] font-bold text-white transition enabled:bg-[#125fe8] enabled:shadow-[0_7px_16px_rgba(75,62,224,.22)] enabled:hover:bg-[#0952d2] disabled:cursor-not-allowed">{actionLabel}</button>
    </section>
  );
}
