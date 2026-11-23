import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  MapPin,
  Car,
  Bike,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';

export const SlotCard = ({ slot }) => {
  const { setSelectedSlot } = useApp();

  const availabilityRatio = slot.availableSlots / slot.totalSlots;
  const isLowAvailability = slot.availableSlots <= 2;
  const isAvailable = slot.availableSlots > 0;

  return (
    <div
      onClick={() => setSelectedSlot(slot)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-card hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      {/* Slot Image & Overlays */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={slot.images[0]}
          alt={slot.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Rating Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-extrabold text-slate-900">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{slot.rating}</span>
            <span className="text-[10px] text-slate-400 font-normal">({slot.reviewsCount})</span>
          </div>

          {/* Vehicle Allowed Types */}
          <div className="flex items-center gap-1">
            {slot.allowedVehicles.includes('car') && (
              <span className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 text-xs shadow-sm" title="Car parking available">
                🚗
              </span>
            )}
            {slot.allowedVehicles.includes('bike') && (
              <span className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 text-xs shadow-sm" title="Bike parking available">
                🏍️
              </span>
            )}
          </div>
        </div>

        {/* Bottom Image Overlay: Distance & Live Availability Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            <span className="truncate">{slot.distanceKm} km away</span>
            <span className="text-purple-300">•</span>
            <span>{slot.walkingTimeMins}m walk</span>
          </div>

          {/* Slots remaining badge */}
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-black backdrop-blur-md flex items-center gap-1.5 shadow-md ${
              isLowAvailability
                ? 'bg-amber-500/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{slot.availableSlots} / {slot.totalSlots} Slots Remaining</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-myspot-700 transition-colors line-clamp-1">
            {slot.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{slot.address}</span>
          </p>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {slot.hasCctv && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-100">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                CCTV Badge
              </span>
            )}
            {slot.hasEvCharging && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-100">
                <Zap className="w-3 h-3 text-emerald-600" />
                EV Charging
              </span>
            )}
            {slot.isCovered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-100">
                <Layers className="w-3 h-3 text-indigo-600" />
                Covered Roof
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Pricing & Action Button */}
        <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Rate</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-myspot-900">₹{slot.pricePerHour}</span>
              <span className="text-xs font-semibold text-slate-500">/ hour</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSlot(slot);
            }}
            disabled={!isAvailable}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all ${
              isAvailable
                ? 'bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white shadow-glow'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Book Slot' : 'Full'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
