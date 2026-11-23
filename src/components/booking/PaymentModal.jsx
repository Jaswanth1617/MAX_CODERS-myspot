import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, bookingData, onComplete }) => {
  const { createBooking, showToast, setIsOwnerDashboardOpen } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'offline'
  const [onlineType, setOnlineType] = useState('upi'); // 'upi' | 'card' | 'wallet'
  const [upiId, setUpiId] = useState('rohit@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen || !bookingData) return null;

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (paymentMethod === 'online') {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#6366F1', '#EC4899', '#10B981']
        });
      }

      const confirmedBooking = createBooking({
        ...bookingData,
        paymentMethod,
      });

      setIsComplete(true);

      setTimeout(() => {
        setIsComplete(false);
        onClose();
        if (onComplete) onComplete(confirmedBooking);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wide">
            Checkout & Confirmation
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1">Select Payment Method</h3>
          <p className="text-xs text-slate-500">
            Booking for <strong className="text-slate-700">{bookingData.slot.name}</strong> • {bookingData.durationHours}h duration
          </p>
        </div>

        {/* Total Amount Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-myspot-900 via-myspot-800 to-indigo-900 text-white flex items-center justify-between mb-5 shadow-glow-sm">
          <div>
            <div className="text-xs text-purple-200 font-medium">Total Payable Amount</div>
            <div className="text-2xl font-black">₹{bookingData.totalAmount.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">
              Vehicle: {bookingData.vehiclePlate}
            </span>
          </div>
        </div>

        {/* Method 1: Online vs Method 2: Offline Selector */}
        <div className="space-y-3 mb-5">
          {/* ONLINE PAYMENT OPTION */}
          <div
            onClick={() => setPaymentMethod('online')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'online'
                ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                : 'border-slate-200 hover:border-purple-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Online Payment (Instant Confirmation)</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    UPI, Credit/Debit Card, NetBanking (Instant digital QR pass)
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'online' ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                }`}
              >
                {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Sub-options for Online */}
            {paymentMethod === 'online' && (
              <div className="mt-3 pt-3 border-t border-purple-200/80 space-y-2 animate-in fade-in">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: '⚡' },
                    { id: 'card', label: 'Card', icon: '💳' },
                    { id: 'wallet', label: 'Wallet', icon: '👛' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOnlineType(sub.id);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        onlineType === sub.id
                          ? 'bg-white border-purple-600 text-purple-900 shadow-sm'
                          : 'bg-purple-100/50 border-transparent text-slate-600'
                      }`}
                    >
                      <span className="mr-1">{sub.icon}</span> {sub.label}
                    </button>
                  ))}
                </div>

                {onlineType === 'upi' && (
                  <div className="relative pt-1">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OFFLINE PAYMENT OPTION */}
          <div
            onClick={() => setPaymentMethod('offline')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'offline'
                ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                : 'border-slate-200 hover:border-amber-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Offline Payment (Pay at Parking Lot)</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                      Hold Status
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay via Cash / Direct UPI on arrival to lot supervisor
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'offline' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                }`}
              >
                {paymentMethod === 'offline' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Offline Explanation Box */}
            {paymentMethod === 'offline' && (
              <div className="mt-3 p-3 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-950 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Slot Hold & Owner Approval Process:</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Choosing offline payment will place your slot on <strong>HOLD</strong>. The parking owner receives an instant alert to confirm your booking. Once approved, you will receive the confirmed entry ticket.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security & Action Button */}
        <div className="space-y-3">
          <button
            onClick={handlePayNow}
            disabled={isProcessing || isComplete}
            className={`w-full py-4 px-4 rounded-2xl text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all ${
              paymentMethod === 'online'
                ? 'bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-700 hover:to-orange-600'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{paymentMethod === 'online' ? 'Processing Secure Payment...' : 'Placing Slot on HOLD...'}</span>
              </div>
            ) : isComplete ? (
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5" />
                <span>{paymentMethod === 'online' ? 'Payment Verified!' : 'Hold Request Sent!'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>
                  {paymentMethod === 'online'
                    ? `Pay ₹${bookingData.totalAmount.toFixed(2)} & Confirm`
                    : 'Request Offline Hold Booking'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted Smart Mobility Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
