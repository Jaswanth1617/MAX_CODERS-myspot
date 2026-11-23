import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Layers, Wallet, Building2, TrendingUp } from 'lucide-react';

export const HostBottomNav = () => {
  const { hostActiveTab, setHostActiveTab, bookings, slots } = useApp();

  const pendingHoldCount = bookings.filter((b) => b.bookingStatus === 'hold').length;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: pendingHoldCount > 0 ? pendingHoldCount : null,
    },
    {
      id: 'slots',
      label: 'Slots',
      icon: Layers,
      badge: null,
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: Wallet,
      badge: null,
    },
  ];

  return (
    <div className="fixed bottom-[10%] left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      {/* Floating 3 Circular Navigation Icons Bar */}
      <nav
        aria-label="Host Navigation"
        className="pointer-events-auto flex items-center gap-4 sm:gap-6 px-5 py-3 rounded-full bg-white/95 backdrop-blur-xl border border-purple-200/90 shadow-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = hostActiveTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setHostActiveTab(item.id)}
              className="group flex flex-col items-center relative focus:outline-none"
              aria-label={item.label}
              id={`host-bottom-nav-${item.id}`}
            >
              {/* Circular Action Button */}
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-tr from-purple-800 via-myspot-700 to-indigo-600 text-white shadow-glow ring-4 ring-purple-200/60 scale-110 -translate-y-1'
                    : 'bg-purple-50/80 hover:bg-purple-100 text-slate-600 hover:text-myspot-700 border border-purple-100'
                }`}
              >
                <Icon
                  className={`w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`}
                />

                {/* Badge for pending approvals or alerts */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider mt-1 transition-colors ${
                  isActive ? 'text-myspot-800 font-black' : 'text-slate-500 group-hover:text-myspot-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
