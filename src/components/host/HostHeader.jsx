import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Sparkles,
  ShieldCheck,
  Building2,
  Car,
  Layers,
  ArrowRightLeft,
  Video,
  User,
  Plus
} from 'lucide-react';

export const HostHeader = () => {
  const {
    user,
    slots,
    bookings,
    notifications,
    setNotifications,
    setIsHostSidebarOpen,
    setIsAddNewSpaceModalOpen,
    setIsHostProfileModalOpen,
    setActiveRole,
    showToast
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  // Host managed slots
  const hostSlots = slots.filter((s) => s.ownerId === user?.id || s.id.includes('host') || true);
  const totalBays = hostSlots.reduce((acc, s) => acc + (s.totalSlots || 0), 0);
  const pendingApprovals = bookings.filter((b) => b.bookingStatus === 'hold').length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSwitchToSeeker = () => {
    setActiveRole('seeker');
    showToast('Switched to Slot Seeker (Driver) Mode', 'info');
  };

  return (
    <header className="sticky top-0 z-40 glass-purple bg-white/95 border-b border-purple-100/90 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHostSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-myspot-900 hover:bg-purple-100/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Open host navigation menu"
            id="host-sidebar-toggle-btn"
          >
            <Menu className="w-6 h-6 text-myspot-800" />
          </button>

          <div className="flex items-center gap-2 select-none cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-800 via-myspot-700 to-indigo-600 flex items-center justify-center text-white shadow-glow">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-myspot-900 via-purple-800 to-indigo-700 bg-clip-text text-transparent">
                  myspot
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
                  Host
                </span>
              </div>
              <p className="text-[10px] font-bold text-purple-700 -mt-0.5 hidden sm:block">
                Parking Partner & Revenue Portal
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Managed Space Status Pill */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-bold text-slate-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{hostSlots.length} Parking Locations Live</span>
            <span className="text-purple-300">•</span>
            <span className="text-purple-700 font-extrabold">{totalBays} Total Bays</span>
          </div>
        </div>

        {/* Right Actions: Add Space, Switch to Seeker, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Space Button */}
          <button
            onClick={() => setIsAddNewSpaceModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-extrabold shadow-glow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Space</span>
          </button>

          {/* Switch to Seeker Mode Button */}
          <button
            onClick={handleSwitchToSeeker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all shadow-xs"
            title="Switch to Driver / Seeker Mode"
          >
            <Car className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Seeker Mode</span>
          </button>

          {/* Notifications Flyout */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-purple-100/70 relative transition-colors focus:outline-none"
              aria-label="Host notifications"
            >
              <Bell className="w-5 h-5 text-myspot-800" />
              {(unreadCount > 0 || pendingApprovals > 0) && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {pendingApprovals > 0 ? pendingApprovals : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-card border border-purple-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-sm text-slate-900">Host Activity Alerts</h4>
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

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-6">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs transition-colors ${
                          n.read
                            ? 'bg-slate-50 border-slate-100 text-slate-600'
                            : 'bg-purple-50/70 border-purple-200 text-slate-900 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-purple-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar in Top Right */}
          <button
            onClick={() => setIsHostProfileModalOpen(true)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-purple-100/70 hover:bg-purple-200/70 border border-purple-200 transition-all text-xs font-semibold text-slate-800 shadow-xs"
            title="View Host Profile & Bank Settlement Info"
          >
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Host'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-600"
              />
              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-2.5 h-2.5 rounded-full ring-1 ring-white" />
            </div>
            <span className="hidden sm:inline-block max-w-[100px] truncate font-bold text-myspot-900">
              {user?.name?.split(' ')[0] || 'Host'}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 -ml-0.5" title="Aadhaar Verified Owner" />
          </button>
        </div>
      </div>
    </header>
  );
};
