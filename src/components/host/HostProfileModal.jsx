import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShieldCheck,
  Phone,
  Mail,
  CreditCard,
  Building2,
  CheckCircle2,
  Video,
  Wallet,
  Save,
  Check
} from 'lucide-react';

export const HostProfileModal = () => {
  const { isHostProfileModalOpen, setIsHostProfileModalOpen, user, setUser, showToast } = useApp();

  const [payoutUpi, setPayoutUpi] = useState(user?.payoutUpi || '9876543210@okaxis');
  const [bankAccount, setBankAccount] = useState(user?.bankAccount || 'HDFC0001842 •••• 7892');
  const [isSaved, setIsSaved] = useState(false);

  if (!isHostProfileModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      payoutUpi,
      bankAccount
    });
    setIsSaved(true);
    showToast('Host profile & payout accounts saved!', 'success');
    setTimeout(() => {
      setIsSaved(false);
      setIsHostProfileModalOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsHostProfileModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt="Host"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-600 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">{user?.name || 'Verified Host Partner'}</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Host Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email || 'host@myspot.app'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Identity Verification Badges */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Verified Host Credentials
            </span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Phone OTP Verified:</span>
              <span className="font-bold text-slate-900">{user?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">UIDAI Aadhaar Verified:</span>
              <span className="font-mono font-bold text-purple-950">
                XXXX-XXXX-{user?.aadhaar ? user.aadhaar.slice(-4) : '5678'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-purple-100 text-emerald-700 font-bold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Land Title Deed Verified
              </span>
              <span>100% Authorized</span>
            </div>
          </div>

          {/* Payout Settings */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Settlement UPI ID (Instant Payouts)</label>
            <input
              type="text"
              required
              value={payoutUpi}
              onChange={(e) => setPayoutUpi(e.target.value)}
              placeholder="e.g. 9876543210@okaxis"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account / IFSC</label>
            <input
              type="text"
              required
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="e.g. HDFC0001842 •••• 7892"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* CCTV Kit Status */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Video className="w-5 h-5 text-indigo-700" />
              <div>
                <span className="font-extrabold text-slate-900 block">myspot AI CCTV Sentinel</span>
                <span className="text-[10px] text-slate-500">24/7 Optical Plate Recognition Active</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Active
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save Payout Details'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
