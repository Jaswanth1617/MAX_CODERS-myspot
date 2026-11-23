import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Layers,
  Plus,
  Car,
  Bike,
  ShieldCheck,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Eye,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Radio,
  X
} from 'lucide-react';

export const HostSlotsPage = () => {
  const { user, slots, setSlots, bookings, setIsAddNewSpaceModalOpen, showToast } = useApp();

  const hostSlots = slots.filter((s) => s.ownerId === user?.id || s.id.includes('host') || true);
  const totalBays = hostSlots.reduce((acc, s) => acc + (s.totalSlots || 0), 0);
  const totalFree = hostSlots.reduce((acc, s) => acc + (s.availableSlots || 0), 0);
  const totalOccupied = totalBays - totalFree;

  const [selectedSlotForProof, setSelectedSlotForProof] = useState(null);

  const handleToggleBayOccupancy = (slotId, bayId) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const updatedBays = s.bays.map((b) =>
            b.id === bayId ? { ...b, isOccupied: !b.isOccupied } : b
          );
          const freeCount = updatedBays.filter((b) => !b.isOccupied).length;
          return {
            ...s,
            bays: updatedBays,
            availableSlots: freeCount,
          };
        }
        return s;
      })
    );
    showToast(`Updated occupancy status for ${bayId}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Parking Slots & Spaces
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
              {hostSlots.length} Locations Managed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your registered parking lands, real-time bay allocation, CCTV surveillance, and hourly rates.
          </p>
        </div>

        <button
          onClick={() => setIsAddNewSpaceModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-glow flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Parking Space</span>
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-card text-center sm:text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Slots
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
            {hostSlots.length}
          </span>
          <span className="text-[10px] text-purple-700 font-bold hidden sm:inline">
            Active on Seeker Map
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-card text-center sm:text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Bays Capacity
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
            {totalBays}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold hidden sm:inline">
            {totalFree} Free Right Now
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-card text-center sm:text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Occupancy Rate
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
            {totalBays > 0 ? Math.round((totalOccupied / totalBays) * 100) : 0}%
          </span>
          <span className="text-[10px] text-indigo-700 font-bold hidden sm:inline">
            {totalOccupied} Vehicles Parked
          </span>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-6">
        {hostSlots.map((slot) => {
          return (
            <div
              key={slot.id}
              className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-card flex flex-col justify-between"
            >
              {/* Slot Top Header with Photo & Details */}
              <div className="p-5 sm:p-6 border-b border-purple-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={slot.images[0] || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&auto=format&fit=crop&q=80'}
                    alt={slot.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-purple-200 shadow-sm shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">{slot.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                        ● LIVE & ACTIVE
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{slot.address}</span>
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-900 text-xs font-bold border border-purple-200">
                        <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                        Land Deed Verified
                      </span>

                      {slot.hasCctv && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200">
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                          {slot.cctvBadgeText || 'AI CCTV Active'}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {slot.rating || 5.0} Rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Proof viewer */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-purple-50">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block sm:text-right">
                      Pricing Rate
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-myspot-900">₹{slot.pricePerHour}</span>
                      <span className="text-xs text-slate-500 font-semibold">/ hr</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSlotForProof(slot)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Land Deed Proof</span>
                  </button>
                </div>
              </div>

              {/* Bay Layout Status Visualizer */}
              <div className="p-5 sm:p-6 bg-purple-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span className="font-extrabold text-xs text-slate-900">
                      Live Bay Occupancy Status ({slot.availableSlots} of {slot.totalSlots} Bays Free)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    Tap any bay to manually toggle Free / Occupied
                  </span>
                </div>

                {/* Grid of Bays */}
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                  {slot.bays?.map((bay) => {
                    const matchedBooking = bookings.find(
                      (b) =>
                        b.slotId === slot.id &&
                        b.bayNumber === bay.id &&
                        (b.bookingStatus === 'confirmed' || b.bookingStatus === 'hold')
                    );

                    return (
                      <button
                        key={bay.id}
                        type="button"
                        onClick={() => handleToggleBayOccupancy(slot.id, bay.id)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[90px] ${
                          bay.isOccupied
                            ? 'bg-slate-100 border-slate-300 text-slate-600 shadow-inner'
                            : 'bg-white border-emerald-300 text-emerald-900 shadow-sm hover:border-emerald-400 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {bay.type === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                        </div>
                        <div className="font-mono font-black text-sm text-slate-900 my-0.5">
                          {bay.id}
                        </div>
                        {bay.isOccupied ? (
                          <div className="text-[9px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200">
                            {matchedBooking ? matchedBooking.vehiclePlate : 'Occupied'}
                          </div>
                        ) : (
                          <div className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                            ✓ Free
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Land Proof Preview Modal */}
      {selectedSlotForProof && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedSlotForProof(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black uppercase mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Land Ownership Proof</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{selectedSlotForProof.name}</h3>
              <p className="text-xs text-slate-500">{selectedSlotForProof.address}</p>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Land Ownership Deed / Property Document:
                </span>
                <img
                  src={selectedSlotForProof.landPhotoProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'}
                  alt="Land Proof Document"
                  className="w-full h-48 rounded-2xl object-cover border border-purple-200 shadow-sm"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Land Parking Slot Space Photo:
                </span>
                <img
                  src={selectedSlotForProof.images[0] || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'}
                  alt="Parking Land Space Photo"
                  className="w-full h-40 rounded-2xl object-cover border border-purple-200 shadow-sm"
                />
              </div>
            </div>

            <button
              onClick={() => setSelectedSlotForProof(null)}
              className="w-full mt-4 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-xs transition-colors"
            >
              Close Proof
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
