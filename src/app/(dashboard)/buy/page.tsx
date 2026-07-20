'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { AmountKeypad } from '@/components/dashboard/AmountKeypad';

const BUY_RATE = 90;
const PLATFORM_UPI_ID = process.env.NEXT_PUBLIC_PLATFORM_UPI_ID || 'p2pexchange@upi';

export default function BuyPage() {
  const { getAccessToken } = usePrivy();
  const [step, setStep] = useState<1 | 2>(1);
  const [amountUsdc, setAmountUsdc] = useState('');
  const [upiRef, setUpiRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const amountInr = Number(amountUsdc || 0) * BUY_RATE;

  const submit = async () => {
    if (!/^\d{12}$/.test(upiRef)) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/transactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'BUY', amountInr, amountUsdt: Number(amountUsdc), upiRef }),
      });
      const data = await res.json();
      setResult({ success: data.success, message: data.success ? 'Payment submitted. Your USDT will arrive after verification.' : data.error || 'Unable to submit payment.' });
      if (data.success) { setAmountUsdc(''); setUpiRef(''); }
    } catch { setResult({ success: false, message: 'Network error. Please try again.' }); } finally { setLoading(false); }
  };

  if (step === 1) return <AmountKeypad amount={amountUsdc} onChange={setAmountUsdc} limit="0 USDT" actionLabel="Continue" onContinue={() => setStep(2)} />;

  return (
    <section className="pt-5 animate-slide-up">
      <div className="rounded-[23px] bg-[#f6f9ff] p-7">
        <p className="text-[17px] font-medium text-[#57505e]">You&apos;ll receive</p>
        <h2 className="mt-1 text-[46px] font-extrabold tracking-[-.06em] text-[#125fe8]">{amountUsdc} <span className="text-lg text-[#36313a]">USDT</span></h2>
        <p className="mt-4 text-[18px] text-[#514c58]">Pay exactly <strong>₹{amountInr.toFixed(2)}</strong> via UPI.</p>
      </div>
      <div className="mt-8 rounded-[22px] border border-[#e8e5ed] bg-white p-6 shadow-[0_3px_8px_rgba(43,35,77,.05)]">
        <p className="text-[18px] font-bold">Make UPI Payment</p>
        <p className="mt-2 text-[15px] text-[#5e5964]">Send your payment to this UPI ID and enter the UTR below.</p>
        <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f6f9ff] px-4 py-4"><code className="font-semibold text-[#125fe8]">{PLATFORM_UPI_ID}</code><Copy size={19} className="text-[#125fe8]"/></div>
        <label className="mt-7 block text-[15px] font-semibold">12-digit UPI reference</label>
        <input value={upiRef} onChange={(event) => setUpiRef(event.target.value.replace(/\D/g, '').slice(0, 12))} inputMode="numeric" placeholder="Enter UTR number" className="mt-2 w-full rounded-xl border border-[#e1dde7] px-4 py-4 text-[17px] outline-none transition focus:border-[#125fe8] focus:ring-4 focus:ring-[#eeebff]" />
        {result && <p className={`mt-4 flex gap-2 rounded-xl p-3 text-sm ${result.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{result.success ? <CheckCircle size={18}/> : <AlertCircle size={18}/>} {result.message}</p>}
        <button onClick={submit} disabled={loading || !/^\d{12}$/.test(upiRef)} className="mt-6 w-full rounded-xl bg-[#125fe8] py-4 text-[18px] font-bold text-white disabled:bg-[#91bdfb]">{loading ? 'Submitting...' : 'Submit & Verify'}</button>
        <button onClick={() => setStep(1)} className="mt-4 w-full text-[16px] font-semibold text-[#125fe8]">Back to amount</button>
      </div>
    </section>
  );
}
