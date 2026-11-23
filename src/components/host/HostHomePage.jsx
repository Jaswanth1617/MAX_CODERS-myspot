import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PassVerificationModal } from '../booking/PassVerificationModal';
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Car,
  Bike,
  Zap,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Video,
  PlusCircle,
  QrCode,
  Search,
  Users,
  MapPin,
  Sparkles,
  Phone,
  ArrowRight,
  Filter,
  Layers,
  Banknote,
  Radio
} from 'lucide-react';

export const HostHomePage = () => {
  const {
    user,
    slots,
    bookings,
    approveHoldBooking,
    rejectHoldBooking,
    checkInVehicle,
    checkOutVehicle,
    setIsAddNewSpaceModalOpen,
    setIsHostProfileModalOpen,
    setHostActiveTab,
    showToast
  } = useApp();

  const [bookingFilter, setBookingFilter] = useState('all'); // 'all' | 'hold' | 'confirmed'
  const [selectedPassForScan, setSelectedPassForScan] = useState(null);

  // Host managed slots
  const hostSlots = slots.filter((s) => s.ownerId === user?.id || s.id.includes('host') || true);
  const totalBays = hostSlots.reduce((acc, s) => acc + (s.totalSlots || 0), 0);
  const availableBays = hostSlots.reduce((acc, s) => acc + (s.availableSlots || 0), 0);
  const occupiedBays = totalBays - availableBays;

  // Bookings calculations
  const pendingHoldBookings = bookings.filter((b) => b.bookingStatus === 'hold');
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');
  
  // Total Revenue Calculation
  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.bookingStatus === 'confirmed' || b.paymentStatus === 'paid') {
      return sum + (b.totalAmount || 0);
    }
    return sum;
  }, 0);

  // Filtered recent bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'hold') return b.bookingStatus === 'hold';
    if (bookingFilter === 'confirmed') return b.bookingStatus === 'confirmed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-6">
      {/* Welcome & Host Profile Overview Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950 via-myspot-900 to-indigo-950 text-white shadow-card relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Host Partner Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || 'Partner Host'}!
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
              Real-time monitoring of your parking spaces, live seeker reservations, and automated entry verification.
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddNewSpaceModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-myspot-600 to-indigo-600 hover:from-myspot-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-glow flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Space</span>
            </button>

            <button
              onClick={() => setHostActiveTab('slots')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs backdrop-blur-md transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Manage Bays</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Revenue */}
        <div
          onClick={() => setHostActiveTab('revenue')}
          className="p-5 rounded-3xl bg-white border border-purple-100 shadow-card hover:shadow-glow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% this week
          </span>
        </div>

        {/* 2. Occupied Bays vs Total */}
        <div
          onClick={() => setHostActiveTab('slots')}
          className="p-5 rounded-3xl bg-white border border-purple-100 shadow-card hover:shadow-glow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Occupancy</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {occupiedBays} / {totalBays}
          </div>
          <span className="text-[11px] text-purple-700 font-bold flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {availableBays} Free Bays Right Now
          </span>
        </div>

        {/* 3. Pending Offline Hold Approvals */}
        <div
          onClick={() => setBookingFilter('hold')}
          className={`p-5 rounded-3xl border shadow-card transition-all cursor-pointer ${
            pendingHoldBookings.length > 0
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white border-purple-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hold Requests</span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                pendingHoldBookings.length > 0
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {pendingHoldBookings.length}
          </div>
          <span
            className={`text-[11px] font-bold mt-1 block ${
              pendingHoldBookings.length > 0 ? 'text-amber-800' : 'text-slate-400'
            }`}
          >
            {pendingHoldBookings.length > 0 ? 'Action required (Confirm pass)' : 'All requests confirmed'}
          </span>
        </div>

        {/* 4. AI CCTV & Security Status */}
        <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Security</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI CCTV Live</span>
          </div>
          <span className="text-[11px] text-indigo-700 font-bold block mt-1">
            24/7 Optical Plate Detection
          </span>
        </div>
      </div>

      {/* RECENT BOOKINGS OF THE SLOT SEEKER SECTION */}
      <section aria-label="Recent Bookings of Slot Seekers" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Recent Bookings of the Slot Seeker
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                {bookings.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live reservations made by drivers with instant pass approvals, check-in, and cash collections.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-purple-100 shadow-sm self-start sm:self-auto">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'hold', label: `Pending Hold (${pendingHoldBookings.length})` },
              { id: 'confirmed', label: `Confirmed (${confirmedBookings.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBookingFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  bookingFilter === f.id
                    ? 'bg-gradient-to-r from-purple-800 to-indigo-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 shadow-card">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">No bookings in this category</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              When a slot seeker reserves one of your parking spaces, their booking will show here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredBookings.map((b) => {
              const isHold = b.bookingStatus === 'hold';
              const isConfirmed = b.bookingStatus === 'confirmed';
              const isCompleted = b.bookingStatus === 'completed';

              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl bg-white border transition-all shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isHold
                      ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/30'
                      : isConfirmed
                      ? 'border-purple-100 hover:border-purple-300'
                      : 'border-slate-200 opacity-80'
                  }`}
                >
                  {/* Left: Driver, Vehicle & Bay info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-800 border border-purple-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                      {b.vehicleType === 'bike' ? '🏍️' : '🚗'}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 tracking-wide">
                          {b.vehiclePlate}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-mono font-bold text-xs border border-purple-200">
                          {b.bayNumber}
                        </span>
                        {isHold && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 animate-pulse">
                            ⏳ OFFLINE HOLD REQUEST
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            CONFIRMED PASS
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                        <span className="font-bold text-slate-900">{b.driverName || 'Aditya Verma'}</span>
                        <span className="text-slate-400">•</span>
                        <a href={`tel:${b.driverPhone || '+919845012345'}`} className="text-purple-700 font-semibold hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{b.driverPhone || '+91 98450 12345'}</span>
                        </a>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{b.slotName}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 pt-0.5">
                        <span>Duration: <strong>{b.durationHours} Hours</strong></span>
                        <span>•</span>
                        <span>
                          Payment: <strong className="text-purple-950 uppercase font-black">{b.paymentMethod}</strong> (
                          {b.paymentStatus === 'paid' ? 'Paid Online' : 'Collect Cash at Bay'}
                          )
                        </span>
                        <span>•</span>
                        <span>Total: <strong className="text-slate-900 font-black">₹{Number(b.totalAmount).toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Approve/Decline for Hold, Check-In, View QR) */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-purple-100">
                    {/* If Offline Hold, show Approve & Decline */}
                    {isHold && (
                      <>
                        <button
                          onClick={() => rejectHoldBooking(b.id)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => approveHoldBooking(b.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-glow-sm flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Send Pass</span>
                        </button>
                      </>
                    )}

                    {/* If Confirmed, show Check-In / Check-Out */}
                    {isConfirmed && !b.isCheckedIn && (
                      <button
                        onClick={() => checkInVehicle(b.id)}
                        className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 text-xs font-black transition-all flex items-center gap-1"
                      >
                        <Car className="w-3.5 h-3.5 text-purple-700" />
                        <span>Check-In Vehicle</span>
                      </button>
                    )}

                    {isConfirmed && b.isCheckedIn && (
                      <button
                        onClick={() => checkOutVehicle(b.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-black transition-all"
                      >
                        <span>Check-Out (Free Bay)</span>
                      </button>
                    )}

                    {/* Scan / Validate Pass Details button */}
                    <button
                      onClick={() => setSelectedPassForScan(b)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-extrabold shadow-glow-sm flex items-center gap-1.5 transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify QR Pass</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* QR Pass Verification Modal Popup */}
      {selectedPassForScan && (
        <PassVerificationModal
          passData={selectedPassForScan}
          onClose={() => setSelectedPassForScan(null)}
          onConfirmHold={(id) => approveHoldBooking(id)}
        />
      )}
    </div>
  );
};
