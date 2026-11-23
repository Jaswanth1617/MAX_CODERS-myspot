import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { PassVerificationModal } from './PassVerificationModal';
import {
  X,
  QrCode,
  MapPin,
  Clock,
  Car,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Plus,
  Copy,
  ExternalLink,
  Check,
  ScanLine
} from 'lucide-react';

export const DigitalPassModal = () => {
  const { user, userLocation, activeBookingForPass, setActiveBookingForPass, showToast, cancelBooking } = useApp();

  const [timeLeftMinutes, setTimeLeftMinutes] = useState(115);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  useEffect(() => {
    if (!activeBookingForPass) return;
    const timer = setInterval(() => {
      setTimeLeftMinutes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000);
    return () => clearInterval(timer);
  }, [activeBookingForPass]);

  // Generate Real Valid QR Code Data URL on booking change
  useEffect(() => {
    if (!activeBookingForPass) return;
    const booking = activeBookingForPass;

    // Create universal verification URL that any phone / QR reader can scan and open
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

    const params = new URLSearchParams({
      verifyPass: booking.id,
      slot: booking.slotName || '',
      address: booking.slotAddress || '',
      bay: booking.bayNumber || '',
      plate: booking.vehiclePlate || '',
      type: booking.vehicleType || 'car',
      status: booking.bookingStatus || 'confirmed',
      dur: String(booking.durationHours || 2),
      total: String(booking.totalAmount || 100),
      method: booking.paymentMethod || 'online',
      driver: booking.friendDetails?.name || user?.name || 'Authorized Driver',
      phone: booking.friendDetails?.phone || user?.phone || '+91 98765 43210',
      created: booking.createdAt || new Date().toISOString()
    });

    const fullUrl = `${origin}${pathname}?${params.toString()}`;
    setVerificationUrl(fullUrl);

    // Generate real QR code image
    QRCode.toDataURL(
      fullUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#1E1B4B',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      }
    );
  }, [activeBookingForPass, user]);

  if (!activeBookingForPass) return null;

  const booking = activeBookingForPass;
  const isHold = booking.bookingStatus === 'hold';
  const isConfirmed = booking.bookingStatus === 'confirmed';

  const hoursLeft = Math.floor(timeLeftMinutes / 60);
  const minsLeft = timeLeftMinutes % 60;

  const handleExtendTime = () => {
    setTimeLeftMinutes(prev => prev + 60);
    showToast('Extended booking by +1 Hour! Wallet debited ₹40.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (verificationUrl) {
      navigator.clipboard.writeText(verificationUrl);
      setIsCopied(true);
      showToast('📋 Pass verification link copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={() => setActiveBookingForPass(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-slate-700 hover:bg-slate-100 shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Header Card */}
          <div
            className={`p-6 text-white text-center ${
              isConfirmed
                ? 'bg-gradient-to-br from-myspot-900 via-myspot-700 to-indigo-800'
                : 'bg-gradient-to-br from-amber-800 via-amber-700 to-orange-800'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2 border border-white/20">
              {isConfirmed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confirmed Digital Parking Pass</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>Hold (Pending Owner Approval)</span>
                </>
              )}
            </div>

            <h3 className="text-xl font-black">{booking.slotName}</h3>
            <p className="text-xs text-purple-200 line-clamp-1 mt-0.5">{booking.slotAddress}</p>

            {/* Assigned Bay Badge */}
            <div className="mt-4 inline-block px-5 py-2 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-inner">
              <span className="text-[10px] uppercase tracking-widest text-purple-200 font-bold block">
                Assigned Bay Number
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white">
                {booking.bayNumber}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-5 sm:p-6 text-center bg-white space-y-4">
            {/* Scannable QR Container */}
            <div className="relative inline-block p-4 rounded-3xl bg-purple-50/80 border-2 border-purple-200 shadow-soft">
              {/* Real high-res scannable QR Code */}
              {qrCodeDataUrl ? (
                <div className="relative group">
                  <img
                    src={qrCodeDataUrl}
                    alt={`Scannable QR Pass for ${booking.id}`}
                    className="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-2xl bg-white p-2 shadow-inner"
                  />
                  {/* Subtle live optical scan indicator */}
                  <div className="absolute inset-x-2 top-2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse rounded-full opacity-60 pointer-events-none" />
                </div>
              ) : (
                <div className="w-48 h-48 mx-auto flex items-center justify-center bg-purple-100 rounded-2xl animate-pulse text-xs font-bold text-purple-800">
                  Generating Scannable QR...
                </div>
              )}

              <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-purple-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Scannable QR • Valid on Any Device</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Pass ID: {booking.id}
              </span>
            </div>

            {/* Verification Test & Copy Quick Actions */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-all flex items-center gap-1.5 border border-purple-200 shadow-sm"
              >
                <ScanLine className="w-3.5 h-3.5 text-purple-700" />
                <span>Preview / Test Scan Details</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
                title="Copy direct verification URL"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-left p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Vehicle Plate</span>
                <span className="font-mono font-extrabold text-slate-900">{booking.vehiclePlate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Duration</span>
                <span className="font-bold text-slate-900">{booking.durationHours} Hours (Paid ₹{booking.totalAmount.toFixed(2)})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Payment Method</span>
                <span className="font-bold text-purple-900 uppercase">{booking.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Remaining Time</span>
                <span className="font-extrabold text-emerald-700">{hoursLeft}h {minsLeft}m</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.9716},${userLocation?.lng || 77.5946}&destination=${encodeURIComponent(booking.slotName + ', ' + booking.slotAddress)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Turn-by-Turn Navigation</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExtendTime}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Extend (+1h)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Pass Verification Simulation View */}
      {isVerificationModalOpen && (
        <PassVerificationModal
          passData={booking}
          onClose={() => setIsVerificationModalOpen(false)}
        />
      )}
    </>
  );
};
