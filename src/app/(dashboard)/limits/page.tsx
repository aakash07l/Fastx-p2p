import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function LimitsPage() {
  return (
    <div className="animate-slide-up pt-10 pb-10">
      <h2 className="text-center text-[25px] font-bold tracking-[-.04em]">Per Transaction Limits</h2>
      <div className="mt-12 grid grid-cols-2 gap-6 px-5">
        <Limit label="Buy" value="$0" />
        <Limit label="Sell/Pay" value="$100" />
      </div>
      <p className="mt-14 flex items-center gap-4 text-[19px] font-medium"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#125fe8]"><TrendingUp size={23}/></span>Unlock Higher Limits with Stake & ZK Verify</p>
      <section className="mt-8 rounded-[25px] bg-[#edf5ff] p-7 shadow-[0_4px_15px_rgba(18,95,232,.1)]"><p className="flex items-center gap-2 text-[14px] font-bold tracking-[.24em] text-[#125fe8]"><Sparkles size={19}/>INSTANT</p><h3 className="mt-6 text-[27px] font-bold tracking-[-.055em]">Complete verification, Raise Limits</h3><p className="mt-3 text-[18px] leading-7 text-[#56505f]">Complete a secure FastX P2P verification to unlock up to +50 USDT per transaction limit on Buy, Sell and Pay.</p><div className="mt-6 grid grid-cols-[1fr_42px_1fr] items-center gap-2"><div className="rounded-2xl bg-white px-4 py-4"><small className="block text-[12px] font-medium text-[#5a5461]">VERIFY</small><strong className="text-[19px]">Your profile</strong></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dbe9ff] text-[#125fe8]"><ArrowRight size={16}/></span><div className="rounded-2xl bg-white px-4 py-4"><small className="block text-[12px] font-medium text-[#5a5461]">UNLOCK</small><strong className="text-[17px] text-emerald-500">+0.1 <span className="font-medium text-[#3c3741]">USDT Limit</span></strong><small className="block text-[11px] text-[#5d5762]">BUY, SELL & PAY</small></div></div><button className="mt-5 flex w-full items-center justify-center gap-3 rounded-[17px] bg-[#125fe8] py-5 text-[20px] font-bold text-white">Verify FastX P2P <ArrowRight size={22}/></button></section>
      <h3 className="mt-11 text-[25px] font-bold tracking-[-.05em]">Verify securely, Increase Limits</h3><section className="mt-7 overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,#125fe8,#074abf)] p-7 text-white"><div className="flex items-end justify-between"><p className="max-w-[300px] text-[20px] font-medium leading-8">All FastX P2P tasks use private verification while increasing your limits.</p><ShieldCheck size={56} className="text-white/80"/></div><Link href="/help" className="mt-6 inline-block rounded-xl border border-white/60 px-4 py-2 font-semibold">Learn more</Link></section>
    </div>
  );
}

function Limit({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center gap-3"><span className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full bg-[#f1f7ff] text-[#125fe8]"><BadgeDollarSign size={38} strokeWidth={1.7}/></span><span><small className="block text-[18px] font-medium">{label}</small><strong className="block text-[45px] leading-none tracking-[-.07em] text-[#3a86ff]">{value}</strong></span></div>;
}
