import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParkingMap } from '../map/ParkingMap';
import { SearchFilters } from './SearchFilters';
import { SlotCard } from './SlotCard';
import { SlotDetailsModal } from './SlotDetailsModal';
import { PaymentModal } from '../booking/PaymentModal';
import { Sparkles, MapPin, Layers, ShieldCheck, Flame, Filter } from 'lucide-react';

export const HomePage = () => {
  const {
    slots,
    searchQuery,
    vehicleFilter,
    onlyCctv,
    onlyEv,
    priceSort,
    setSelectedSlot,
    selectedSlot,
  } = useApp();

  const [activeBookingPayload, setActiveBookingPayload] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Filter & Sort Logic
  const filteredSlots = slots.filter((slot) => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = slot.name.toLowerCase().includes(q);
      const matchAddress = slot.address.toLowerCase().includes(q);
      if (!matchName && !matchAddress) return false;
    }

    // Vehicle Type filter
    if (vehicleFilter !== 'all') {
      if (!slot.allowedVehicles.includes(vehicleFilter)) return false;
    }

    // CCTV filter
    if (onlyCctv && !slot.hasCctv) return false;

    // EV filter
    if (onlyEv && !slot.hasEvCharging) return false;

    return true;
  });

  // Sorting
  const sortedSlots = [...filteredSlots].sort((a, b) => {
    if (priceSort === 'asc') return a.pricePerHour - b.pricePerHour;
    if (priceSort === 'desc') return b.pricePerHour - a.pricePerHour;
    if (priceSort === 'rating') return b.rating - a.rating;
    return a.distanceKm - b.distanceKm; // Default nearest
  });

  const handleProceedToPayment = (payload) => {
    setActiveBookingPayload(payload);
    setSelectedSlot(null); // close details modal
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-5">
      {/* Top 30% Dynamic Geolocation Map */}
      <section aria-label="Interactive Map Area">
        <ParkingMap />
      </section>

      {/* Search & Filter Container */}
      <section aria-label="Search and Filters Area">
        <SearchFilters />
      </section>

      {/* Available Slots Section Header */}
      <section aria-label="Available Parking Slots List" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Available Parking Slots
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                {sortedSlots.length} Found
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time verified spots in your registered location with instant online / offline booking
            </p>
          </div>
        </div>

        {/* Available Slots Container Grid */}
        {sortedSlots.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 shadow-card">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">No parking slots found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search location, clearing filters, or switching vehicle type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedSlots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        )}
      </section>

      {/* Slot Details & Route Navigation Modal */}
      {selectedSlot && (
        <SlotDetailsModal onProceedToPayment={handleProceedToPayment} />
      )}

      {/* Checkout / Payment Method Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingData={activeBookingPayload}
        />
      )}
    </div>
  );
};
