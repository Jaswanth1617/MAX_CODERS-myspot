import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Bike,
  Zap,
  MapPin,
  User,
  Phone,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Check,
  Layers,
  Lock,
  Unlock,
  Radio,
  QrCode
} from 'lucide-react';

export const PassVerificationModal = ({ passData, onClose, onCheckIn, onCheckOut, onConfirmHold }) => {
  const { showToast, approveHoldBooking } = useApp();

  const [gateStatus, setGateStatus] = useState(passData?.bookingStatus === 'confirmed' ? 'open' : 'closed');
  const [isCheckedIn, setIsCheckedIn] = useState(passData?.isCheckedIn || false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!passData) return null;

  const isConfirmed = passData.bookingStatus === 'confirmed' || passData.status === 'confirmed';
  const isHold = passData.bookingStatus === 'hold' || passData.status === 'hold';
  const isCancelled = passData.bookingStatus === 'cancelled' || passData.status === 'cancelled';

  const handleToggleGate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newStatus = gateStatus === 'open' ? 'closed' : 'open';
      setGateStatus(newStatus);
      showToast(
        newStatus === 'open'
          ? '🟢 Boom barrier gate lifted! Vehicle authorized for entry.'
          : '🔴 Boom barrier gate lowered.',
        newStatus === 'open' ? 'success' : 'info'
      );
    }, 400);
  };

  const handleCheckInVehicle = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckedIn(true);
      setGateStatus('open');
      if (onCheckIn) onCheckIn(passData.id);
      showToast(`✅ Vehicle ${passData.vehiclePlate} successfully checked in at Bay ${passData.bayNumber}!`, 'success');
    }, 600);
  };

  const handleConfirmOfflineCash = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onConfirmHold) onConfirmHold(passData.id);
      else approveHoldBooking(passData.id);
      passData.bookingStatus = 'confirmed';
      passData.paymentStatus = 'paid';
      setGateStatus('open');
      showToast(`💵 Cash payment collected! Pass ${passData.id} is now officially CONFIRMED.`, 'success');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-200 animate-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
          aria-label="Close verification modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card with Security Shield */}
        <div
          className={`p-6 text-white text-center relative overflow-hidden ${
            isConfirmed
              ? 'bg-gradient-to-br from-emerald-900 via-myspot-900 to-indigo-900'
              : isHold
              ? 'bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900'
              : 'bg-gradient-to-br from-slate-900 to-slate-800'
          }`}
        >
          {/* Subtle background glow circle */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Verification Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2.5 border border-white/25">
            {isConfirmed ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified & Valid Parking Pass</span>
              </>
            ) : isHold ? (
              <>
                <Clock className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Hold (Pending Cash & Approval)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Pass Inactive or Cancelled</span>
              </>
            )}
          </div>

          <h2 className="text-2xl font-black tracking-tight">{passData.slotName || 'myspot Parking Hub'}</h2>
          <p className="text-xs text-purple-200 line-clamp-1 mt-0.5">{passData.slotAddress || passData.address}</p>

          {/* Large Assigned Bay Badge */}
          <div className="mt-4 inline-flex flex-col items-center px-6 py-2.5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-inner">
            <span className="text-[10px] uppercase tracking-widest text-purple-200 font-bold">
              Assigned Parking Bay
            </span>
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-white mt-0.5">
              {passData.bayNumber || passData.bay || 'BAY A-01'}
            </span>
          </div>
        </div>

        {/* Scrollable Content Details */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Boom Barrier Gate Access Simulation Strip */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              gateStatus === 'open'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/80 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 ${
                  gateStatus === 'open' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {gateStatus === 'open' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>Boom Barrier Gate:</span>
                  <span className="uppercase font-mono font-black">{gateStatus === 'open' ? 'LIFTED / OPEN' : 'LOCKED / DOWN'}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {gateStatus === 'open'
                    ? 'Automated RFID / Optical boom barrier sensor triggered.'
                    : 'Gate barrier in lowered position. Tap toggle to lift.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleGate}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs shrink-0 shadow-sm transition-all"
            >
              {gateStatus === 'open' ? 'Lower Gate' : 'Lift Gate'}
            </button>
          </div>

          {/* Vehicle & Plate Highlight Card */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-2xl shadow-sm">
                {passData.vehicleType === 'bike' || passData.type === 'bike' ? '🏍️' : '🚗'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Vehicle</span>
                <span className="text-base font-mono font-black text-slate-900 tracking-wider">
                  {passData.vehiclePlate || passData.plate || 'KA 03 MG 7821'}
                </span>
                <span className="text-[11px] text-slate-500 block capitalize">
                  {passData.vehicleType || passData.type || 'Car'} • {passData.modelName || 'Standard'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                License Valid
              </span>
            </div>
          </div>

          {/* Driver & Identity Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Driver / Customer</span>
              <span className="font-extrabold text-slate-900 truncate block">
                {passData.driver || passData.name || 'Rohit Sharma'}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-purple-600" />
                <a href={`tel:${passData.phone || '+919876543210'}`} className="hover:underline">
                  {passData.phone || '+91 98765 43210'}
                </a>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Identity Verification</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                UIDAI Aadhaar Verified
              </span>
              <span className="text-[10px] font-mono text-slate-400 block">
                UID: XXXX-XXXX-5678
              </span>
            </div>
          </div>

          {/* Payment & Session Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/90 to-indigo-50/60 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span>Pass Reference ID</span>
              <span className="font-mono font-bold text-purple-950">{passData.id || passData.verifyPass}</span>
            </div>
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span>Duration Reserved</span>
              <span className="font-bold text-slate-900">{passData.durationHours || passData.dur || 2} Hours</span>
            </div>
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span>Payment Mode & Status</span>
              <span className="font-extrabold text-purple-900 uppercase">
                {passData.paymentMethod || passData.method || 'ONLINE'} ({passData.paymentStatus || (isConfirmed ? 'PAID' : 'PENDING')})
              </span>
            </div>
            <div className="pt-2 border-t border-purple-200 flex items-center justify-between font-black text-sm text-slate-900">
              <span>Total Pass Bill</span>
              <span className="text-base text-myspot-900 font-black">
                ₹{Number(passData.totalAmount || passData.total || 104.4).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cryptographic QR Security Seal */}
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-purple-600" />
              <span>DIGITAL SIGNATURE: SHA256-VERIFIED</span>
            </div>
            <span className="text-emerald-700 font-bold">256-BIT SSL MATCH</span>
          </div>
        </div>

        {/* Footer Actions for Owner / Supervisor / Driver */}
        <div className="p-4 sm:p-5 bg-white border-t border-purple-100 flex flex-col sm:flex-row items-center gap-2.5">
          {/* If Hold booking, show Collect Cash & Confirm button */}
          {isHold && (
            <button
              onClick={handleConfirmOfflineCash}
              disabled={isProcessing}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <Banknote className="w-4 h-4" />
              <span>Collect Cash (₹{Number(passData.totalAmount || passData.total || 104.4).toFixed(2)}) & Confirm Pass</span>
            </button>
          )}

          {/* If Confirmed, show Check-In / Gate Entry button */}
          {isConfirmed && !isCheckedIn && (
            <button
              onClick={handleCheckInVehicle}
              disabled={isProcessing}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-myspot-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check-In Vehicle & Lift Gate</span>
            </button>
          )}

          {isConfirmed && isCheckedIn && (
            <div className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs text-center border border-emerald-300">
              ✓ Vehicle is Currently Parked in Bay {passData.bayNumber || passData.bay}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
