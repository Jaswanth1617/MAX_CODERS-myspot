import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Car,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  Send,
  User
} from 'lucide-react';

export const HostReportPage = () => {
  const { hostReports, submitHostReport, bookings, slots } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('new'); // 'new' | 'history'

  const [formData, setFormData] = useState({
    seekerName: bookings[0]?.driverName || 'Aditya Verma',
    vehiclePlate: bookings[0]?.vehiclePlate || 'KA 05 NZ 1102',
    slotName: slots[0]?.name || 'Cyber Heights Smart Multi-Level Hub',
    bayNumber: 'BAY A-02',
    issueCategory: 'Overstayed without payment',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=80',
  });

  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueCategories = [
    'Overstayed without payment',
    'Parked in wrong bay / blocked driveway',
    'Damaged parking barrier, gate or property',
    'Refused offline cash payment to supervisor',
    'Unauthorized vehicle or fraudulent number plate',
    'Littering or nuisance on parking grounds'
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
        setFormData({ ...formData, photoUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitHostReport(formData);
      setIsSubmitting(false);
      setFormData({
        ...formData,
        description: '',
      });
      setActiveSubTab('history');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Report Problematic Slot Seeker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              Host Protection
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            File incident reports against drivers who overstay, block bays, or damage your parking space.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-purple-100 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('new')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'new'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-purple-900'
            }`}
          >
            File New Report
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'history'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-purple-900'
            }`}
          >
            Filed Reports ({hostReports.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: File New Report */}
      {activeSubTab === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-card space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Seeker Violation Details</h3>
                <p className="text-xs text-slate-500">Provide details and photo proof for investigation and penalty fine.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select from recent bookings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Slot Seeker / Vehicle
                  </label>
                  <select
                    value={formData.vehiclePlate}
                    onChange={(e) => {
                      const matched = bookings.find((b) => b.vehiclePlate === e.target.value);
                      setFormData({
                        ...formData,
                        vehiclePlate: e.target.value,
                        seekerName: matched?.driverName || formData.seekerName,
                        bayNumber: matched?.bayNumber || formData.bayNumber,
                        slotName: matched?.slotName || formData.slotName
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.vehiclePlate}>
                        {b.vehiclePlate} ({b.driverName || 'Driver'}) • {b.bayNumber}
                      </option>
                    ))}
                    <option value="CUSTOM">Other / Unregistered Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Driver / Seeker Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.seekerName}
                    onChange={(e) => setFormData({ ...formData, seekerName: e.target.value })}
                    placeholder="e.g. Aditya Verma"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Parking Space & Bay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Parking Location
                  </label>
                  <select
                    value={formData.slotName}
                    onChange={(e) => setFormData({ ...formData, slotName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {slots.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assigned / Blocked Bay Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bayNumber}
                    onChange={(e) => setFormData({ ...formData, bayNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. BAY A-02"
                    className="w-full uppercase font-mono px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Issue Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nature of Violation / Unwanted Activity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {issueCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, issueCategory: cat })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        formData.issueCategory === cat
                          ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Description of Incident
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain what the slot seeker did, time of overstay, or damages caused..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Photo Evidence Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Photo / CCTV Evidence Attachment
                </label>
                <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 bg-purple-50/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Evidence"
                      className="w-16 h-12 rounded-xl object-cover border border-purple-200 shadow-sm"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Vehicle Photo Evidence</span>
                      <span className="text-[10px] text-slate-400">Captured license plate & bay status</span>
                    </div>
                  </div>
                  <label className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold cursor-pointer transition-colors">
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Incident Report to myspot Security'}</span>
              </button>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950 to-indigo-950 text-white shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base">Host Protection Guarantee</h4>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                myspot guarantees 100% compensation for overstay hours and property damage through our verified Seeker Security Deposit fund.
              </p>
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automatic Overstay Surcharge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>24/7 Towing & Marshal Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Filed Reports History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {hostReports.map((r) => (
            <div
              key={r.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100 shadow-card flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-purple-950 bg-purple-100 px-2 py-0.5 rounded-md">
                    {r.id}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">{r.issueCategory}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ● {r.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                  <span>Seeker: <strong>{r.seekerName}</strong></span>
                  <span>•</span>
                  <span>Plate: <strong className="font-mono">{r.vehiclePlate}</strong></span>
                  <span>•</span>
                  <span>Location: <strong>{r.slotName} ({r.bayNumber})</strong></span>
                </div>

                <p className="text-xs text-slate-700 bg-purple-50/50 p-3 rounded-2xl border border-purple-100 leading-relaxed">
                  "{r.description}"
                </p>

                {r.actionTaken && (
                  <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resolution: {r.actionTaken}</span>
                  </div>
                )}
              </div>

              {r.photoUrl && (
                <img
                  src={r.photoUrl}
                  alt="Evidence"
                  className="w-28 h-20 rounded-2xl object-cover border border-purple-200 shadow-sm shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
