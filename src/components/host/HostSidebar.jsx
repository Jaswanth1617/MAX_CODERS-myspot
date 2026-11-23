import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShieldCheck,
  Phone,
  Building2,
  PlusCircle,
  Headphones,
  Sparkles,
  LogOut,
  ChevronRight,
  Wallet,
  FileText,
  AlertTriangle,
  Layers,
  Video,
  Banknote,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const HostSidebar = () => {
  const {
    isHostSidebarOpen,
    setIsHostSidebarOpen,
    user,
    setUser,
    slots,
    setHostActiveTab,
    setIsAddNewSpaceModalOpen,
    setIsHostProfileModalOpen,
    setIsSupportModalOpen,
    setActiveRole,
    showToast
  } = useApp();

  if (!isHostSidebarOpen) return null;

  const hostSlots = slots.filter((s) => s.ownerId === user?.id || s.id.includes('host') || true);

  const handleSignOut = () => {
    setUser(null);
    setIsHostSidebarOpen(false);
    showToast('Signed out from Host account', 'info');
  };

  const handleNavigate = (tab) => {
    setHostActiveTab(tab);
    setIsHostSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsHostSidebarOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-purple-950 via-myspot-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-extrabold text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base tracking-tight">myspot Host</h3>
                <span className="px-1.5 py-0.2 rounded-md bg-purple-500/30 text-purple-200 text-[10px] font-bold border border-purple-400/30">
                  Partner
                </span>
              </div>
              <p className="text-xs text-purple-200">Land & Parking Monetization</p>
            </div>
          </div>
          <button
            onClick={() => setIsHostSidebarOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Host Profile Info Card */}
        <div className="p-5 border-b border-purple-100 bg-purple-50/50">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Host'}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-600 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 truncate text-base">{user?.name || 'Partner Host'}</h4>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'host@myspot.app'}</p>

              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Land Owner Verified
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
                  <Phone className="w-3 h-3 text-purple-600" />
                  OTP Verified
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-slate-600">
            <span className="text-slate-400 font-medium">Aadhaar UID:</span>
            <span className="font-mono font-bold text-slate-700">
              XXXX-XXXX-{user?.aadhaar ? user.aadhaar.slice(-4) : '5678'}
            </span>
          </div>
        </div>

        {/* Sidebar Menu Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {/* 1. My Profile */}
          <button
            onClick={() => {
              setIsHostSidebarOpen(false);
              setIsHostProfileModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-900">
                  My Profile & Bank Details
                </div>
                <div className="text-xs text-slate-500">Aadhaar UID, Payout UPI & Bank</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
          </button>

          {/* 2. Add New Space */}
          <button
            onClick={() => {
              setIsHostSidebarOpen(false);
              setIsAddNewSpaceModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-950 hover:from-purple-100 hover:to-indigo-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold text-purple-950">
                  Add New Space
                </div>
                <div className="text-xs text-purple-700">List parking land / driveway</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </button>

          {/* 3. Report (Report Slot Seeker) */}
          <button
            onClick={() => handleNavigate('report')}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-900">
                  Report Slot Seeker
                </div>
                <div className="text-xs text-slate-500">Report overstay, damage or blocking</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
          </button>

          {/* 4. Help Desk */}
          <button
            onClick={() => {
              setIsHostSidebarOpen(false);
              setIsSupportModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-900">
                  Host Help Desk & Support
                </div>
                <div className="text-xs text-slate-500">24/7 priority host partner assistance</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          {/* Summary of Managed Spaces */}
          <div className="pt-3 border-t border-purple-100">
            <div className="px-2 mb-2 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Your Active Spaces ({hostSlots.length})</span>
              <button
                onClick={() => handleNavigate('slots')}
                className="text-purple-600 hover:underline capitalize font-bold"
              >
                View All
              </button>
            </div>
            <div className="space-y-1.5">
              {hostSlots.slice(0, 2).map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleNavigate('slots')}
                  className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-100/50 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 block truncate">{s.name}</span>
                    <span className="text-[10px] text-slate-500">{s.availableSlots} of {s.totalSlots} Bays Free</span>
                  </div>
                  <span className="font-mono font-black text-xs text-purple-900">₹{s.pricePerHour}/h</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Sign Out */}
        <div className="p-4 border-t border-purple-100 bg-slate-50">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors border border-red-200/60"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of myspot Host</span>
          </button>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400 font-medium">myspot Partner Hub v2.4 • 256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
