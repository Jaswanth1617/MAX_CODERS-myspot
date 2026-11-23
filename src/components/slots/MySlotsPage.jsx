import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  QrCode,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Car,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  RotateCcw
} from 'lucide-react';

export const MySlotsPage = () => {
  const {
    userLocation,
    bookings,
    setActiveBookingForPass,
    cancelBooking,
    approveHoldBooking,
    setIsOwnerDashboardOpen,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all' | 'confirmed' | 'hold'

  const filteredBookings = bookings.filter((b) => {
    if (activeSubTab === 'confirmed') return b.bookingStatus === 'confirmed';
    if (activeSubTab === 'hold') return b.bookingStatus === 'hold';
    return true;
  });

  const confirmedCount = bookings.filter(b => b.bookingStatus === 'confirmed').length;
  const holdCount = bookings.filter(b => b.bookingStatus === 'hold').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Slot Bookings & Passes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
              {bookings.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your digital entry QR passes, view real-time offline hold status, or navigate to your parking lot.
          </p>
        </div>

        {/* Quick Link to Find More Slots */}
        <button
          onClick={() => setActiveTab('home')}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-glow transition-all flex items-center gap-1.5"
        >
          <span>Find New Slot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Reservations', count: bookings.length },
          { id: 'confirmed', label: 'Active Passes', count: confirmedCount },
          { id: 'hold', label: 'Pending Hold (Offline)', count: holdCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === tab.id
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === tab.id ? 'bg-purple-700 text-purple-100' : 'bg-purple-100 text-purple-800'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 shadow-card">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
            <CalendarCheck2 className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800">No bookings in this tab</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Book a slot from the Home map to receive your instant digital parking pass.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-glow transition-all"
          >
            Explore Nearby Slots
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'confirmed';
            const isHold = b.bookingStatus === 'hold';
            const isCancelled = b.bookingStatus === 'cancelled';

            return (
              <div
                key={b.id}
                className={`bg-white rounded-3xl overflow-hidden border shadow-card transition-all flex flex-col justify-between ${
                  isHold
                    ? 'border-amber-200/90 ring-2 ring-amber-100'
                    : isConfirmed
                    ? 'border-purple-100'
                    : 'border-slate-200 opacity-75'
                }`}
              >
                {/* Header Strip */}
                <div
                  className={`p-4 flex items-center justify-between gap-2 text-xs ${
                    isHold
                      ? 'bg-amber-50 text-amber-950 border-b border-amber-200'
                      : isConfirmed
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50/50 text-purple-950 border-b border-purple-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">{b.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isConfirmed && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Pass Confirmed
                      </span>
                    )}
                    {isHold && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px] border border-amber-300 animate-pulse">
                        <Clock className="w-3 h-3 text-amber-700" />
                        HOLD (Awaiting Owner)
                      </span>
                    )}
                    {isCancelled && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-extrabold text-[10px]">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{b.slotName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{b.slotAddress}</span>
                      </p>
                    </div>

                    {/* Assigned Bay */}
                    <div className="text-center p-2 rounded-2xl bg-purple-100/70 border border-purple-200 shrink-0">
                      <span className="text-[9px] uppercase font-bold text-purple-800 block">Bay</span>
                      <span className="font-mono font-black text-sm text-purple-950">{b.bayNumber}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-purple-50/40 border border-purple-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Vehicle</span>
                      <span className="font-mono font-extrabold text-slate-800">{b.vehiclePlate}</span>
                      {b.isFriendBooking && (
                        <span className="text-[10px] text-purple-600 block">Friend: {b.friendDetails?.name}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                      <span className="font-bold text-slate-800">{b.durationHours} Hours</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Payment</span>
                      <span className="font-bold text-purple-900 uppercase">
                        {b.paymentMethod} ({b.paymentStatus})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Paid / Due</span>
                      <span className="font-black text-myspot-900">₹{b.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Offline Hold Explanatory & Demo Approval Helper */}
                  {isHold && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                      <p className="text-[11px] leading-relaxed">
                        ⏳ <strong>Offline Request on Hold:</strong> Slot owner is reviewing your request. Pay ₹{b.totalAmount.toFixed(2)} cash to supervisor upon arrival.
                      </p>

                      {/* Quick simulation helper button */}
                      <button
                        onClick={() => {
                          approveHoldBooking(b.id);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ Test Action: Simulate Host Approval</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-purple-100 flex items-center justify-between gap-2">
                  {isConfirmed ? (
                    <>
                      <button
                        onClick={() => setActiveBookingForPass(b)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-black shadow-glow flex items-center justify-center gap-1.5 transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View QR Entry Pass</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 12.9716},${userLocation?.lng || 77.5946}&destination=${encodeURIComponent(b.slotName + ', ' + b.slotAddress)}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors shadow-sm"
                        title="Start GPS Navigation in Google Maps"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                    </>
                  ) : isHold ? (
                    <div className="w-full flex items-center justify-between gap-2">
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="text-xs font-bold text-slate-500 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-red-50"
                      >
                        Cancel Request
                      </button>
                      <button
                        onClick={() => setIsOwnerDashboardOpen(true)}
                        className="text-xs font-extrabold text-purple-700 hover:underline flex items-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Open Host Portal</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Booking Terminated</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
