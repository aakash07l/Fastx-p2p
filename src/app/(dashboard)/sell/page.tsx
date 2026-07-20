'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { AmountKeypad } from '@/components/dashboard/AmountKeypad';

const SELL_RATE = 88;
const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const PLATFORM_HOT_WALLET = process.env.NEXT_PUBLIC_PLATFORM_HOT_WALLET || '0x0000000000000000000000000000000000000000';

export default function SellPage() {
  const { getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const [step, setStep] = useState<1 | 2>(1);
  const [amountUsdc, setAmountUsdc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const amountInr = Number(amountUsdc || 0) * SELL_RATE;

  const sell = async () => {
    if (!amountUsdc || Number(amountUsdc) < 5 || !upiId) return;
    setLoading(true); setResult(null); setStatus('Connecting your wallet...');
    try {
      const activeWallet = wallets[0];
      if (!activeWallet) throw new Error('Please connect your crypto wallet first');
      await activeWallet.switchChain(56);
      setStatus('Approve the USDT transfer in your wallet...');
      const provider = new BrowserProvider(await activeWallet.getEthereumProvider());
      const signer = await provider.getSigner();
      const contract = new Contract(USDT_CONTRACT_ADDRESS, ['function transfer(address to, uint256 value) public returns (bool)'], signer);
      const transaction = await contract.transfer(PLATFORM_HOT_WALLET, parseUnits(amountUsdc, 18));
      setStatus('Waiting for blockchain confirmation...');
      const receipt = await transaction.wait();
      const token = await getAccessToken();
      const res = await fetch('/api/transactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'SELL', amountUsdt: Number(amountUsdc), amountInr, txHash: receipt.hash || transaction.hash, upiId, phone }),
      });
      const data = await res.json();
      setResult({ success: data.success, message: data.success ? `Sell order submitted. ₹${amountInr.toFixed(2)} will be paid to ${upiId}.` : data.error || 'Unable to submit sell order.' });
      if (data.success) { setAmountUsdc(''); setUpiId(''); setPhone(''); }
    } catch (error: unknown) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'Transaction failed. Please retry.' });
    } finally { setLoading(false); setStatus(''); }
  };

  if (step === 1) return <AmountKeypad amount={amountUsdc} onChange={setAmountUsdc} limit="100 USDT" actionLabel="Continue" onContinue={() => setStep(2)} balanceNote="0 USDT" />;

  return (
    <section className="pt-5 animate-slide-up">
      <div className="rounded-[23px] bg-[#f6f9ff] p-7"><p className="text-[17px] font-medium text-[#57505e]">You&apos;re selling</p><h2 className="mt-1 text-[46px] font-extrabold tracking-[-.06em] text-[#125fe8]">{amountUsdc} <span className="text-lg text-[#36313a]">USDT</span></h2><p className="mt-4 text-[18px] text-[#514c58]">You&apos;ll receive <strong>₹{amountInr.toFixed(2)}</strong> at ₹{SELL_RATE}/USDT.</p></div>
      <div className="mt-8 rounded-[22px] border border-[#e8e5ed] bg-white p-6 shadow-[0_3px_8px_rgba(43,35,77,.05)]">
        <h2 className="text-[19px] font-bold">Where should we pay you?</h2>
        <label className="mt-6 block text-[15px] font-semibold">Payout UPI ID</label>
        <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="yourname@upi" className="mt-2 w-full rounded-xl border border-[#e1dde7] px-4 py-4 text-[17px] outline-none transition focus:border-[#125fe8] focus:ring-4 focus:ring-[#eeebff]" />
        <label className="mt-5 block text-[15px] font-semibold">Mobile number <span className="font-normal text-[#79737e]">(optional)</span></label>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder="+91 99999 99999" className="mt-2 w-full rounded-xl border border-[#e1dde7] px-4 py-4 text-[17px] outline-none transition focus:border-[#125fe8] focus:ring-4 focus:ring-[#eeebff]" />
        {loading && <p className="mt-5 flex items-center gap-2 rounded-xl bg-[#f0edff] p-3 text-sm text-[#125fe8]"><Loader2 className="animate-spin" size={18}/>{status}</p>}
        {result && <p className={`mt-4 flex gap-2 rounded-xl p-3 text-sm ${result.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{result.success ? <CheckCircle size={18}/> : <AlertCircle size={18}/>} {result.message}</p>}
        <button onClick={sell} disabled={loading || !upiId || Number(amountUsdc) < 5} className="mt-6 w-full rounded-xl bg-[#125fe8] py-4 text-[18px] font-bold text-white disabled:bg-[#91bdfb]">{loading ? 'Processing...' : 'Transfer USDT & Sell'}</button>
        <button onClick={() => setStep(1)} disabled={loading} className="mt-4 w-full text-[16px] font-semibold text-[#125fe8]">Back to amount</button>
      </div>
    </section>
  );
}
