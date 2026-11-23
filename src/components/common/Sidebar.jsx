import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShieldCheck,
  Phone,
  Mail,
  Car,
  PlusCircle,
  Headphones,
  Sparkles,
  LogOut,
  ChevronRight,
  Wallet,
  FileText,
  BadgeCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const Sidebar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    user,
    setUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsNewVehicleModalOpen,
    setIsSupportModalOpen,
    setIsOwnerDashboardOpen,
    setActiveTab,
    showToast
  } = useApp();

  if (!isSidebarOpen) return null;

  const handleSignOut = () => {
    setUser(null);
    setIsSidebarOpen(false);
    showToast('Signed out successfully', 'info');
  };

  const handleDemoSignIn = () => {
    setIsSidebarOpen(false);
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-br from-myspot-900 via-myspot-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-lg text-white">
              P
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">myspot</h3>
              <p className="text-xs text-purple-200">Smart Mobility Companion</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-5 border-b border-purple-100 bg-purple-50/50">
          {user ? (
            <div>
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white" title="Identity Verified">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 truncate text-base">{user.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  
                  {/* Verified Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Aadhaar Verified
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
                      <Phone className="w-3 h-3 text-purple-600" />
                      OTP Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Aadhaar info pill */}
              <div className="mt-3.5 pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-slate-600">
                <span className="text-slate-400 font-medium">Aadhaar UID:</span>
                <span className="font-mono font-bold text-slate-700 tracking-wider">
                  XXXX-XXXX-{user.aadhaar ? user.aadhaar.slice(-4) : '5678'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-sm font-semibold text-slate-800 mb-2">You are currently browsing as Guest</p>
              <button
                onClick={handleDemoSignIn}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 text-white font-bold text-xs shadow-glow hover:opacity-95"
              >
                Register / Sign In
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {/* Registered Vehicles Summary */}
          {user && (
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900/60">
                  Registered Vehicles ({user.registeredVehicles?.length || 0})
                </span>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setIsNewVehicleModalOpen(true);
                  }}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {user.registeredVehicles?.map((veh) => (
                  <div
                    key={veh.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-700 font-bold shadow-sm">
                        {veh.type === 'bike' ? '🏍️' : '🚗'}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-xs text-slate-900 tracking-wide">
                          {veh.plateNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {veh.modelName} {veh.isPrimary && '• Primary'}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Vehicle Registration Option */}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              setIsNewVehicleModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-900">
                  New Vehicle Registration
                </div>
                <div className="text-xs text-slate-500">Add car, bike, or EV license</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
          </button>

          {/* Customer Service Support */}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
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
                  Customer Service & Support
                </div>
                <div className="text-xs text-slate-500">24/7 AI chat & emergency call</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          {/* Slot Owner / Host Portal */}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              setIsOwnerDashboardOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-purple-200/80 text-purple-950 hover:from-purple-100 hover:to-indigo-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold text-purple-950">
                  Host & Owner Portal
                </div>
                <div className="text-xs text-purple-700">Approve offline hold bookings</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </button>

          {/* My Bookings Shortcut */}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              setActiveTab('slots');
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 group-hover:text-purple-900">
                  My Bookings & Passes
                </div>
                <div className="text-xs text-slate-500">Active tickets & receipts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600" />
          </button>
        </div>

        {/* Footer / Sign Out */}
        <div className="p-4 border-t border-purple-100 bg-slate-50/80">
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors border border-red-200/60"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of myspot
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 text-white font-bold text-xs shadow-glow hover:opacity-95"
            >
              Create New Account (Slot Seeker)
            </button>
          )}

          <div className="text-center mt-2.5">
            <span className="text-[10px] text-slate-400 font-medium">myspot v2.4 Smart Mobility • Secured by 256-bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
