import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Bell,
  Menu,
  ShieldCheck,
  User,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
  Car
} from 'lucide-react';

export const Header = () => {
  const {
    user,
    userLocation,
    requestUserLocation,
    isLocating,
    setIsSidebarOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    activeRole,
    setActiveRole,
    notifications,
    setNotifications,
    setIsOwnerDashboardOpen,
    bookings,
    showToast
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingHoldCount = bookings.filter(b => b.bookingStatus === 'hold').length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 glass-purple bg-white/90 border-b border-purple-100/80 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-myspot-900 hover:bg-purple-100/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Open navigation menu"
            id="sidebar-toggle-btn"
          >
            <Menu className="w-6 h-6 text-myspot-800" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-myspot-700 via-myspot-600 to-indigo-500 flex items-center justify-center text-white shadow-glow">
              <span className="font-extrabold text-xl tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-myspot-900 via-myspot-700 to-indigo-600 bg-clip-text text-transparent">
                  myspot
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Smart
                </span>
              </div>
              <p className="text-[10px] font-medium text-purple-600/90 -mt-1 hidden sm:block">
                Smart Mobility & Parking
              </p>
            </div>
          </div>
        </div>

        {/* Location Selector Pill */}
        <div className="hidden md:flex items-center">
          <button
            onClick={requestUserLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-all text-xs font-medium text-myspot-900 shadow-sm hover:shadow"
            title="Click to refresh your live GPS location"
          >
            <div className="w-2 h-2 rounded-full bg-myspot-600 animate-ping" />
            <MapPin className="w-3.5 h-3.5 text-myspot-600" />
            <span className="max-w-[200px] truncate text-slate-700 font-semibold">
              {isLocating ? 'Detecting GPS...' : userLocation.address.split(',')[0]}
            </span>
            <span className="text-[10px] text-purple-600 font-bold bg-white px-1.5 py-0.5 rounded-full border border-purple-200">
              Live
            </span>
          </button>
        </div>

        {/* Right Actions: Host Toggle, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Host Mode Quick Switcher */}
          <button
            onClick={() => {
              setIsOwnerDashboardOpen(true);
            }}
            className="relative hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-900 text-xs font-semibold hover:from-purple-100 hover:to-indigo-100 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Host Portal</span>
            {pendingHoldCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                {pendingHoldCount} hold
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-purple-100/70 relative transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-myspot-800" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-card border border-purple-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-purple-600 font-semibold hover:text-purple-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-6">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs transition-colors ${
                          n.read ? 'bg-slate-50/70 border-slate-100 text-slate-600' : 'bg-purple-50/60 border-purple-100 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-purple-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Sign In */}
          {user ? (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-purple-100/60 hover:bg-purple-100 border border-purple-200/80 transition-all text-xs font-semibold text-slate-800"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500"
              />
              <span className="hidden sm:inline-block max-w-[100px] truncate font-bold text-myspot-900">
                {user.name.split(' ')[0]}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 -ml-0.5" title="Aadhaar & Phone Verified" />
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-bold shadow-glow transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
