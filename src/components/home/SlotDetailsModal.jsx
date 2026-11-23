import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParkingMap } from '../map/ParkingMap';
import {
  X,
  Star,
  MapPin,
  Car,
  Bike,
  ShieldCheck,
  Zap,
  Layers,
  Clock,
  User,
  Phone,
  CreditCard,
  Sparkles,
  Users,
  CheckCircle2,
  Navigation,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const SlotDetailsModal = ({ onProceedToPayment }) => {
  const { selectedSlot, setSelectedSlot, user, userLocation, setIsAuthModalOpen, setAuthModalMode } = useApp();

  const [durationHours, setDurationHours] = useState(2);
  const [selectedVehicleId, setSelectedVehicleId] = useState(user?.registeredVehicles?.[0]?.id || 'custom');
  
  // "Book for my friend" state
  const [isFriendBooking, setIsFriendBooking] = useState(false);
  const [friendDetails, setFriendDetails] = useState({
    name: 'Aditya Verma',
    phone: '+91 98450 12345',
    vehiclePlate: 'KA 05 NZ 1102',
    vehicleType: 'car',
  });

  if (!selectedSlot) return null;

  const currentVehicle = user?.registeredVehicles?.find(v => v.id === selectedVehicleId) || {
    type: 'car',
    plateNumber: 'KA 03 MG 7821',
  };

  const rate = selectedSlot.pricePerHour;
  const baseFare = rate * durationHours;
  const platformFee = 10;
  const gst = Math.round(baseFare * 0.18 * 10) / 10;
  const totalAmount = baseFare + platformFee + gst;

  const handleContinue = () => {
    if (!user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    const bookingPayload = {
      slot: selectedSlot,
      durationHours,
      vehiclePlate: isFriendBooking ? friendDetails.vehiclePlate : currentVehicle.plateNumber,
      vehicleType: isFriendBooking ? friendDetails.vehicleType : currentVehicle.type,
      isFriendBooking,
      friendDetails: isFriendBooking ? friendDetails : null,
      totalAmount,
    };

    onProceedToPayment(bookingPayload);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Close Button */}
        <button
          onClick={() => setSelectedSlot(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-slate-900 shadow-md transition-all hover:bg-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Section: Map from User to Destination Route */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                Live Route: User GPS ➔ Destination Slot
              </span>
              <span className="text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-lg border border-purple-200">
                {selectedSlot.distanceKm} km • ~{selectedSlot.drivingEtaMins || Math.round(selectedSlot.distanceKm * 3 + 2)} mins drive
              </span>
            </div>

            {/* Embedded Route Map */}
            <ParkingMap
              heightClass="h-44 sm:h-52"
              highlightSlot={selectedSlot}
              showRoute={true}
            />

            {/* Origin to Destination Summary Banner */}
            <div className="mt-2.5 p-3 rounded-2xl bg-purple-50/80 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-myspot-600 animate-ping" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">Live Origin:</span>
                  <span className="font-bold text-slate-900 truncate max-w-xs">{userLocation.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-purple-700" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">Destination:</span>
                  <span className="font-bold text-purple-950 truncate max-w-xs">{selectedSlot.name} ({selectedSlot.address})</span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedSlot.lat},${selectedSlot.lng}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-glow flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Slot Header Info */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedSlot.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{selectedSlot.address}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{selectedSlot.rating}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{selectedSlot.reviewsCount} reviews</div>
              </div>
            </div>

            {/* Availability & Vehicle Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-purple-50">
              {/* Availability counter */}
              <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{selectedSlot.availableSlots} of {selectedSlot.totalSlots} Slots Available</span>
              </div>

              {/* Vehicle Allowed */}
              <div className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5">
                <span>Vehicles:</span>
                {selectedSlot.allowedVehicles.map(v => (
                  <span key={v} className="uppercase">{v === 'car' ? '🚗 Car' : '🏍️ Bike'}</span>
                ))}
              </div>

              {/* CCTV Badge */}
              {selectedSlot.hasCctv && (
                <div className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{selectedSlot.cctvBadgeText || 'CCTV Monitored'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Parking Bay Visualizer Layout */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Live Parking Bay Status (Bay Assignment)
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
              {selectedSlot.bays.slice(0, 10).map((bay, idx) => (
                <div
                  key={bay.id}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    bay.isOccupied
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : idx === 0
                      ? 'bg-gradient-to-tr from-myspot-700 to-indigo-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-300 font-black'
                      : 'bg-white border-emerald-300 text-emerald-800 font-bold'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold">{bay.type || 'Bay'}</div>
                  <div className="text-xs font-mono font-extrabold">{bay.id}</div>
                  <div className="text-[9px] mt-0.5 font-semibold">
                    {bay.isOccupied ? 'Occupied' : idx === 0 ? 'Assigned' : 'Free'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Select Booking Duration</span>
              </label>
              <span className="text-xs font-black text-myspot-800">
                {durationHours} Hour{durationHours > 1 ? 's' : ''} (₹{selectedSlot.pricePerHour * durationHours})
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {[1, 2, 3, 4, 8].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDurationHours(hrs)}
                  className={`py-2.5 px-3 rounded-2xl font-extrabold text-xs transition-all border ${
                    durationHours === hrs
                      ? 'bg-gradient-to-r from-myspot-700 to-indigo-600 text-white border-transparent shadow-glow-sm'
                      : 'bg-purple-50/60 hover:bg-purple-100 text-slate-700 border-purple-100'
                  }`}
                >
                  {hrs === 8 ? '8h (Day)' : `${hrs} hr${hrs > 1 ? 's' : ''}`}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Selection & "Book for my Friend" Option */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900">Vehicle Assignment</span>
              </div>

              {/* Book for Friend Toggle */}
              <button
                type="button"
                onClick={() => setIsFriendBooking(!isFriendBooking)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isFriendBooking
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Book for my Friend</span>
              </button>
            </div>

            {/* Standard User Vehicle Selection */}
            {!isFriendBooking ? (
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  Select Your Registered Vehicle:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {user?.registeredVehicles?.map((veh) => (
                    <button
                      key={veh.id}
                      type="button"
                      onClick={() => setSelectedVehicleId(veh.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        selectedVehicleId === veh.id
                          ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-white/60 text-slate-600'
                      }`}
                    >
                      <span className="text-lg">{veh.type === 'bike' ? '🏍️' : '🚗'}</span>
                      <div>
                        <div className="font-mono font-bold text-xs text-slate-900">{veh.plateNumber}</div>
                        <div className="text-[10px] text-slate-500">{veh.modelName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Friend Details Form */
              <div className="space-y-2.5 pt-1 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Friend's Name</label>
                    <input
                      type="text"
                      value={friendDetails.name}
                      onChange={(e) => setFriendDetails({ ...friendDetails, name: e.target.value })}
                      placeholder="e.g. Aditya Verma"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Friend's Phone</label>
                    <input
                      type="tel"
                      value={friendDetails.phone}
                      onChange={(e) => setFriendDetails({ ...friendDetails, phone: e.target.value })}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Friend's Vehicle No. Plate</label>
                    <input
                      type="text"
                      value={friendDetails.vehiclePlate}
                      onChange={(e) => setFriendDetails({ ...friendDetails, vehiclePlate: e.target.value.toUpperCase() })}
                      placeholder="KA 05 NZ 1102"
                      className="w-full uppercase px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-mono font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Type</label>
                    <select
                      value={friendDetails.vehicleType}
                      onChange={(e) => setFriendDetails({ ...friendDetails, vehicleType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="car">🚗 Car</option>
                      <option value="bike">🏍️ Bike</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Extra Features & Amenities Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Slot Amenities & Security</label>
            <div className="grid grid-cols-2 gap-2">
              {selectedSlot.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-purple-50/40 p-2 rounded-xl border border-purple-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between font-medium">
              <span>Parking Rate (₹{rate}/hr × {durationHours} hrs)</span>
              <span>₹{baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Platform & Smart Sensor Fee</span>
              <span>₹{platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>GST / Taxes (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-purple-200/80 flex justify-between text-sm font-black text-slate-900">
              <span>Total Payable Amount</span>
              <span className="text-base font-black text-myspot-900">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-purple-100 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Bill</div>
            <div className="text-xl font-black text-myspot-900">₹{totalAmount.toFixed(2)}</div>
          </div>

          <button
            onClick={handleContinue}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
