import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, SlidersHorizontal, Car, Bike, Video, Zap, ArrowUpDown } from 'lucide-react';

export const SearchFilters = () => {
  const {
    searchQuery,
    setSearchQuery,
    vehicleFilter,
    setVehicleFilter,
    onlyCctv,
    setOnlyCctv,
    onlyEv,
    setOnlyEv,
    priceSort,
    setPriceSort
  } = useApp();

  const locationShortcuts = ['All Areas', 'Indiranagar', 'MG Road', 'Whitefield', 'Koramangala', 'Church St'];

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-purple-600" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by registered location, landmark or mall (e.g. Indiranagar, Phoenix, MG Road)..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-purple-200/80 text-sm font-semibold text-slate-900 shadow-soft focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-purple-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Location Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Popular:
        </span>
        {locationShortcuts.map((loc) => {
          const isActive = loc === 'All Areas' ? !searchQuery : searchQuery.toLowerCase() === loc.toLowerCase();
          return (
            <button
              key={loc}
              onClick={() => setSearchQuery(loc === 'All Areas' ? '' : loc)}
              className={`px-3 py-1 rounded-full shrink-0 font-bold transition-all text-xs ${
                isActive
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white hover:bg-purple-50 text-slate-600 border border-purple-100'
              }`}
            >
              {loc}
            </button>
          );
        })}
      </div>

      {/* Filter Row: Vehicle Type, CCTV, EV, Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Vehicle Type Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-purple-100 shadow-sm">
          {[
            { id: 'all', label: 'All Slots' },
            { id: 'car', label: '🚗 Cars', icon: Car },
            { id: 'bike', label: '🏍️ Bikes', icon: Bike },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicleFilter(v.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                vehicleFilter === v.id
                  ? 'bg-gradient-to-r from-myspot-700 to-indigo-600 text-white shadow-glow-sm'
                  : 'text-slate-600 hover:text-myspot-800 hover:bg-purple-50'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Feature Badges & Sorting */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* CCTV Filter */}
          <button
            onClick={() => setOnlyCctv(!onlyCctv)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              onlyCctv
                ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-sm'
                : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-600" />
            <span>CCTV Badge</span>
          </button>

          {/* EV Charging Filter */}
          <button
            onClick={() => setOnlyEv(!onlyEv)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              onlyEv
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 shadow-sm'
                : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>EV Charging</span>
          </button>

          {/* Price / Rating Sort */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-purple-100 text-xs font-bold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600" />
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
              <option value="rating">Top Rated (★ 4.8+)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
