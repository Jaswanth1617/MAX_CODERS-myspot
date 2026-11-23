import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PassVerificationModal } from '../booking/PassVerificationModal';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  User,
  MapPin,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  QrCode,
  Search,
  ScanLine,
  Check,
  AlertCircle
} from 'lucide-react';

export const OwnerDashboardModal = () => {
  const {
    isOwnerDashboardOpen,
    setIsOwnerDashboardOpen,
    bookings,
    approveHoldBooking,
    rejectHoldBooking,
    slots,
    setActiveBookingForPass,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'scanner' | 'locations'
  const [searchPassId, setSearchPassId] = useState('');
  const [selectedPassForVerification, setSelectedPassForVerification] = useState(null);
  const [scanStatusMessage, setScanStatusMessage] = useState('');

  if (!isOwnerDashboardOpen) return null;

  const pendingHoldBookings = bookings.filter((b) => b.bookingStatus === 'hold');
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');

  const handleManualScan = (e) => {
    e.preventDefault();
    if (!searchPassId.trim()) return;

    const query = searchPassId.trim().toUpperCase();
    const matched = bookings.find(
      (b) =>
        b.id.toUpperCase() === query ||
        b.vehiclePlate.toUpperCase().includes(query) ||
        (b.bayNumber && b.bayNumber.toUpperCase() === query)
    );

    if (matched) {
      setSelectedPassForVerification(matched);
      setScanStatusMessage('');
    } else {
      // Create a demonstration validated pass if not in local store
      const demoPass = {
        id: query.startsWith('BKG') ? query : `BKG-${query}`,
        slotName: slots[0]?.name || 'Cyber Heights Smart Multi-Level Hub',
        slotAddress: slots[0]?.address || '100 Feet Road, Indiranagar',
        bayNumber: 'BAY A-04',
        vehiclePlate: query.includes('KA') || query.includes('DL') ? query : 'KA 03 MG 7821',
        vehicleType: 'car',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'online',
        durationHours: 2,
        totalAmount: 104.4,
        driver: 'Rohit Sharma',
        phone: '+91 98765 43210',
        createdAt: new Date().toISOString()
      };
      setSelectedPassForVerification(demoPass);
      setScanStatusMessage('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsOwnerDashboardOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-myspot-700 to-indigo-600 text-white flex items-center justify-center shadow-glow">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">Host & Parking Owner Portal</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
                  Supervisor Mode
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Scan QR passes, verify parking tickets, and manage offline hold bookings.
              </p>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-purple-100 pb-3 mb-4 overflow-x-auto">
            {[
              { id: 'approvals', label: 'Hold Approvals', count: pendingHoldBookings.length, icon: Clock },
              { id: 'scanner', label: 'Scan & Verify QR Pass', count: null, icon: QrCode },
              { id: 'locations', label: 'Managed Lots', count: slots.length, icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-purple-900 text-white shadow-md'
                      : 'bg-purple-50 hover:bg-purple-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-purple-700 text-purple-100' : 'bg-purple-200 text-purple-900'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Pending Offline Hold Approvals */}
          {activeTab === 'approvals' && (
            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pending Offline Hold Requests ({pendingHoldBookings.length})</span>
                  </h4>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Action Required
                  </span>
                </div>

                {pendingHoldBookings.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                    <h5 className="font-bold text-xs text-slate-800">All offline reservations are approved!</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      When a user chooses "Offline Payment (Pay at Lot)", their hold request will show here for instant approval.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingHoldBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 hover:border-amber-300 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{b.slotName}</span>
                              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono font-bold text-xs">
                                Bay {b.bayNumber}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              Vehicle Plate: <strong className="font-mono text-slate-800">{b.vehiclePlate}</strong> ({b.vehicleType})
                            </p>
                            {b.isFriendBooking && (
                              <p className="text-[11px] text-purple-700 font-medium">
                                Booked for friend: {b.friendDetails?.name} ({b.friendDetails?.phone})
                              </p>
                            )}
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Duration: <strong>{b.durationHours} Hours</strong> • Collect Cash: <strong className="text-amber-900">₹{b.totalAmount.toFixed(2)}</strong>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                            <button
                              onClick={() => rejectHoldBooking(b.id)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => {
                                approveHoldBooking(b.id);
                                setSelectedPassForVerification({ ...b, bookingStatus: 'confirmed', paymentStatus: 'paid' });
                              }}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Validate</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Optical QR Scanner & Pass Verifier */}
          {activeTab === 'scanner' && (
            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                    <ScanLine className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Live QR Pass Scanner & Gate Verifier</h4>
                    <p className="text-[11px] text-slate-500">
                      Scan or search any driver's QR code to verify validity and authorize gate entry.
                    </p>
                  </div>
                </div>

                {/* Search / Scan Input */}
                <form onSubmit={handleManualScan} className="flex gap-2 mt-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchPassId}
                      onChange={(e) => setSearchPassId(e.target.value)}
                      placeholder="Enter Pass ID (e.g. BKG-1001) or Vehicle Plate..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white border border-purple-200 text-xs font-semibold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-myspot-700 to-indigo-600 text-white text-xs font-extrabold shadow-glow flex items-center gap-1.5"
                  >
                    <span>Verify Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Quick Scan Active Passes list */}
              <div>
                <h5 className="text-xs font-black uppercase tracking-wider text-purple-900 mb-2">
                  Active Confirmed Passes in Your Lots ({confirmedBookings.length})
                </h5>

                {confirmedBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active passes to scan right now.</p>
                ) : (
                  <div className="space-y-2">
                    {confirmedBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedPassForVerification(b)}
                        className="p-3 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
                            {b.vehicleType === 'bike' ? '🏍️' : '🚗'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-900">{b.id}</span>
                              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-mono font-bold">
                                {b.bayNumber}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">{b.vehiclePlate} • {b.slotName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            Verified
                          </span>
                          <span className="text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform">
                            Scan ➔
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Managed Locations */}
          {activeTab === 'locations' && (
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 mb-2">
                Your Managed Parking Locations ({slots.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {slots.map((s) => (
                  <div key={s.id} className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 truncate">{s.name}</h5>
                      <p className="text-[10px] text-slate-500 truncate">{s.address}</p>
                      <span className="text-[10px] font-bold text-purple-700">₹{s.pricePerHour}/hr</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                        {s.availableSlots}/{s.totalSlots} Free
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500">
            <span>Connected as Parking Lot SuperHost</span>
            <button
              onClick={() => setIsOwnerDashboardOpen(false)}
              className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold transition-colors"
            >
              Back to App
            </button>
          </div>
        </div>
      </div>

      {/* Pass Verification Modal */}
      {selectedPassForVerification && (
        <PassVerificationModal
          passData={selectedPassForVerification}
          onClose={() => setSelectedPassForVerification(null)}
          onConfirmHold={(id) => approveHoldBooking(id)}
        />
      )}
    </>
  );
};
