'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, CheckCircle, ArrowDownCircle, ArrowUpCircle, AlertCircle, Loader2, RefreshCw, Sparkles, Wallet } from 'lucide-react';
import { usePrivy, useCreateWallet, useWallets } from '@privy-io/react-auth';
import QRCode from 'qrcode';

type Tab = 'overview' | 'deposit' | 'withdraw';

interface WalletData {
  usdtBalance: number;
  btcBalance: number;
  ethBalance: number;
  inrBalance: number;
  address: string | null;
}

export default function WalletPage() {
  const { getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const [tab, setTab] = useState<Tab>('overview');
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [detecting, setDetecting] = useState(false);
  const [detectResult, setDetectResult] = useState<{ success: boolean; message: string } | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawResult, setWithdrawResult] = useState<{ success: boolean; message: string } | null>(null);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [walletSetupError, setWalletSetupError] = useState<string | null>(null);

  const { createWallet } = useCreateWallet();

  const hasEmbeddedWallet = wallets.some((connectedWallet) => connectedWallet.walletClientType === 'privy');

  const handleCreateWallet = async () => {
    setCreatingWallet(true);
    setWalletSetupError(null);
    try {
      await createWallet();
      const token = await getAccessToken();
      if (token) {
        const response = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error('Your wallet was created, but FastX P2P could not sync it yet. Please retry.');
      }
      window.location.reload();
    } catch (error) {
      setWalletSetupError(error instanceof Error ? error.message : 'Unable to create your Privy wallet. Please retry.');
    } finally {
      setCreatingWallet(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryTab = params.get('tab') as Tab;
      if (queryTab && ['overview', 'deposit', 'withdraw'].includes(queryTab)) {
        setTab(queryTab);
      }
    }
  }, []);

  const getAuthHeaders = async () => {
    const token = await getAccessToken();
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  };

  const loadWallet = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/wallet', { headers });
      const data = await res.json();
      if (data.success) {
        setWallet(data.data.wallet);
      }
    } catch {}
  }, [getAccessToken]);

  const loadDepositAddress = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/wallet/deposit', { headers });
      const data = await res.json();
      if (data.success && data.data.depositAddress) {
        setDepositAddress(data.data.depositAddress);
        const qr = await QRCode.toDataURL(data.data.depositAddress, {
          width: 240,
          margin: 2,
          color: { dark: '#1e1b4b', light: '#ffffff' },
        });
        setQrDataUrl(qr);
      }
    } catch {}
  }, [getAccessToken]);

  useEffect(() => {
    if (hasEmbeddedWallet) {
      loadWallet();
      if (tab === 'deposit') loadDepositAddress();
    }
  }, [tab, hasEmbeddedWallet, loadWallet, loadDepositAddress]);

  const copyAddress = () => {
    if (depositAddress) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(depositAddress)
          .then(() => setCopied(true))
          .catch(() => fallbackCopy(depositAddress));
      } else {
        fallbackCopy(depositAddress);
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleAutoDetect = useCallback(async (isSilent = false) => {
    if (!isSilent) setDetecting(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/wallet/detect-deposit', { headers });
      const data = await res.json();
      if (data.success && data.detected) {
        setDetectResult({ success: true, message: data.message });
        loadWallet();
      } else if (!isSilent && data.success) {
        setDetectResult({ success: true, message: 'No new deposits detected yet. Scanning BSC Chain...' });
      } else if (!data.success && !isSilent) {
        setDetectResult({ success: false, message: data.error || 'Auto detection failed.' });
      }
    } catch {
      if (!isSilent) setDetectResult({ success: false, message: 'Auto-detection request failed.' });
    } finally {
      if (!isSilent) setDetecting(false);
    }
  }, [loadWallet]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tab === 'deposit' && depositAddress) {
      handleAutoDetect(true);
      interval = setInterval(() => {
        handleAutoDetect(true);
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tab, depositAddress, handleAutoDetect]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) return;
    setLoading(true);
    setWithdrawResult(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers,
        body: JSON.stringify({ asset: 'USDT', amount: parseFloat(withdrawAmount), toAddress: withdrawAddress }),
      });
      const data = await res.json();
      setWithdrawResult({ success: data.success, message: data.success ? `Withdrawal of ${withdrawAmount} USDT submitted! TX: ${data.data?.txHash?.slice(0, 20)}...` : data.error });
      if (data.success) { setWithdrawAmount(''); setWithdrawAddress(''); loadWallet(); }
    } catch {
      setWithdrawResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const balances = [
    { asset: 'USDT', balance: wallet?.usdtBalance || 0, color: '#059669', bgClass: 'bg-emerald-50 border-emerald-200', textClass: 'text-emerald-700', icon: '₮' },
    { asset: 'BTC', balance: wallet?.btcBalance || 0, color: '#F7931A', bgClass: 'bg-orange-50 border-orange-200', textClass: 'text-orange-700', icon: '₿' },
    { asset: 'ETH', balance: wallet?.ethBalance || 0, color: '#627EEA', bgClass: 'bg-blue-50 border-blue-200', textClass: 'text-blue-700', icon: 'Ξ' },
  ];

  if (!hasEmbeddedWallet) {
    return (
      <div className="p-8 rounded-[25px] bg-[#f6f9ff] text-center space-y-6 my-10 animate-slide-up shadow-[0_4px_15px_rgba(50,38,143,.09)]">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#d9e8ff] flex items-center justify-center mx-auto">
          <Wallet size={30} className="text-indigo-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#17161c] tracking-[-.04em]">Setup Your Secure Wallet</h2>
          <p className="text-base text-[#5d5762] leading-relaxed">
            To buy, sell, deposit or withdraw USDT on the platform, you need to create a secure Privy embedded wallet. It takes only 5 seconds.
          </p>
        </div>
        <button
          onClick={handleCreateWallet}
          disabled={creatingWallet}
          className="w-full py-4 rounded-xl bg-[#125fe8] hover:bg-[#0952d2] disabled:opacity-60 active:scale-95 text-white font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {creatingWallet ? <><Loader2 size={17} className="animate-spin"/>Creating wallet…</> : <><Sparkles size={17} /> Create Privy Wallet</>}
        </button>
        {walletSetupError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{walletSetupError}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up pt-2">

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-[#edf5ff] border border-[#ded9f5]">
        {(['overview', 'deposit', 'withdraw'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
              tab === t ? 'bg-white text-[#17161c] shadow-sm border border-[#ded9f5]' : 'text-[#8b8493] hover:text-[#125fe8]'
            }`}
          >
            {t === 'deposit' && <ArrowDownCircle size={13} />}
            {t === 'withdraw' && <ArrowUpCircle size={13} />}
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-3">
          {balances.map(({ asset, balance, bgClass, textClass, icon }) => (
            <div key={asset} className="flex items-center justify-between p-5 rounded-[20px] bg-white border border-[#e5e1e7] hover:border-[#bdb5e9] hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-lg font-bold ${bgClass} ${textClass}`}>
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{asset}</p>
                  <p className="text-[10px] text-gray-400 font-medium">BNB Smart Chain</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-base">{balance.toFixed(asset === 'BTC' ? 5 : 2)}</p>
                <p className="text-[10px] text-gray-400 font-medium">{asset}</p>
              </div>
            </div>
          ))}
          <button
            onClick={loadWallet}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#edf5ff] text-sm font-semibold text-[#125fe8] hover:bg-[#e9e5ff] active:scale-95 transition-all"
          >
            <RefreshCw size={13} /> Refresh Balances
          </button>
        </div>
      )}

      {/* Deposit Tab */}
      {tab === 'deposit' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-5 text-center shadow-sm">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">USDT Deposit Address</h3>
              <p className="text-xs text-gray-400 font-medium">BNB Smart Chain (BEP-20) network</p>
            </div>

            {depositAddress ? (
              <div className="space-y-5">
                <div className="flex justify-center p-3 bg-white border-2 border-gray-100 rounded-2xl w-48 h-48 mx-auto shadow-sm">
                  {qrDataUrl && <img src={qrDataUrl} alt="Deposit Address QR" className="w-full h-full object-contain" />}
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <code className="flex-1 text-xs text-indigo-600 break-all font-mono text-left pl-1 select-all">{depositAddress}</code>
                  <button onClick={copyAddress} className="flex-shrink-0 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all active:scale-90">
                    {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} className="text-gray-500" />}
                  </button>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left">
                  <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Send only <strong>USDT (BEP-20)</strong> to this address. Sending any other network tokens will result in permanent loss.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3">
                <Loader2 size={26} className="animate-spin text-indigo-500" />
                <p className="text-xs font-medium">Fetching Deposit Address...</p>
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-semibold text-gray-900 text-sm">Blockchain Auto-Scanner</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              USDT sent from your external wallets (Binance, Trust Wallet, etc.) will be automatically scanned on-chain.
            </p>

            {detectResult && (
              <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${detectResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {detectResult.success ? <CheckCircle size={15} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />}
                <p className="text-xs font-medium leading-relaxed">{detectResult.message}</p>
              </div>
            )}

            <button
              onClick={() => handleAutoDetect(false)}
              disabled={detecting}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {detecting ? (
                <><Loader2 size={14} className="animate-spin" /> Scanning BSC blockchain...</>
              ) : (
                'Scan For New Deposits'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Tab */}
      {tab === 'withdraw' && (
        <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-base">Withdraw USDT</h3>
            <span className="text-xs text-gray-400 font-medium">
              Available: <span className="text-gray-900 font-bold">{wallet?.usdtBalance?.toFixed(2) || '0.00'} USDT</span>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Amount (USDT)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Min. 5 USDT"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  onClick={() => setWithdrawAmount(String(Math.max(0, (wallet?.usdtBalance || 0) - 1)))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200"
                >
                  MAX
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Destination BEP-20 Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={withdrawAddress}
                onChange={e => setWithdrawAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 text-xs font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 space-y-2">
            <div className="flex justify-between"><span>Transfer Network</span><span className="text-gray-700 font-semibold">BNB Smart Chain (BEP-20)</span></div>
            <div className="flex justify-between"><span>Network Fee</span><span className="text-gray-700 font-semibold">1 USDT</span></div>
            <div className="flex justify-between border-t border-gray-200 pt-2"><span>Net Payout</span><span className="text-emerald-600 font-bold">{Math.max(0, parseFloat(withdrawAmount || '0') - 1).toFixed(2)} USDT</span></div>
          </div>

          {withdrawResult && (
            <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${withdrawResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {withdrawResult.success ? <CheckCircle size={15} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />}
              <p className="text-xs font-medium leading-relaxed">{withdrawResult.message}</p>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={loading || !withdrawAmount || !withdrawAddress || parseFloat(withdrawAmount) < 5}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : 'Confirm Withdrawal'}
          </button>
        </div>
      )}
    </div>
  );
}
