import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { MONTHLY_SPEND_DATA } from '../../data/mockData';
import {
  AlertTriangle,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldAlert,
  Zap,
  Car,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';

export const ReportPage = () => {
  const { reports, submitReport, slots, bookings } = useApp();

  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'analytics'

  const [formData, setFormData] = useState({
    slotName: slots[0]?.name || 'Cyber Heights Smart Multi-Level Plaza',
    issueType: 'Blocked Slot by Unauthorized Vehicle',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&auto=format&fit=crop&q=80',
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.description.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      submitReport(formData);
      setIsSubmitting(false);
      setFormData({
        ...formData,
        description: '',
      });
      setPhotoPreview(null);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reports & Mobility Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
            Support Center
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submit dispute tickets for blocked spots or billing issues, and view your personal parking spend statistics.
        </p>
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'report'
              ? 'bg-purple-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-purple-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Spend & Usage Analytics</span>
        </button>
      </div>

      {/* VIEW 1: REPORT AN ISSUE */}
      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issue Submission Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-purple-100 space-y-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">New Incident Report</h3>
                <p className="text-xs text-slate-500">Fast resolution within 15 minutes by on-ground marshals</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Parking Lot Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Parking Location</label>
                <select
                  value={formData.slotName}
                  onChange={(e) => setFormData({ ...formData, slotName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {slots.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.address.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Issue Category</label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Blocked Slot by Unauthorized Vehicle">🚫 Blocked Slot / Unauthorized Vehicle Parked</option>
                  <option value="Boom Barrier Malfunction">🚧 Boom Barrier / QR Scanner Not Opening</option>
                  <option value="EV Charger Defective">⚡ EV Fast Charger Offline</option>
                  <option value="Billing / Overcharge Issue">💳 Overcharge / Offline Cash Dispute</option>
                  <option value="Damage / Security Concern">🛡️ Vehicle Damage / Security Report</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the vehicle plate, bay number, or problem in detail..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Photo Upload Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Attach Photo Evidence (Optional)</label>
                <div className="border-2 border-dashed border-purple-200 hover:border-purple-300 rounded-2xl p-3 bg-purple-50/30 flex items-center justify-between gap-3">
                  {photoPreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={photoPreview}
                        alt="Evidence"
                        className="w-14 h-11 rounded-lg object-cover border border-purple-200"
                      />
                      <span className="text-xs font-bold text-emerald-700">Photo Attached</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span>Take or upload photo of the issue</span>
                    </div>
                  )}

                  <label className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold cursor-pointer transition-colors">
                    Browse File
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Ticket...</span>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Submit Report Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Past Reports & Resolutions List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Report History & Status ({reports.length})</span>
            </h3>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-3xl bg-white border border-purple-100 shadow-card space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-xs text-purple-700">{rep.id}</span>
                      <h4 className="font-bold text-xs text-slate-900">{rep.issueType}</h4>
                      <p className="text-[11px] text-slate-500">{rep.slotName}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        rep.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-purple-50/40 p-2 rounded-xl">
                    "{rep.description}"
                  </p>

                  {rep.resolution && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                      <strong>Resolution:</strong> {rep.resolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SPEND & USAGE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-card">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Parking Spend</div>
              <div className="text-3xl font-black text-myspot-900 mt-1">₹3,260</div>
              <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <span>+8% vs last month</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-card">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Hours Parked</div>
              <div className="text-3xl font-black text-indigo-900 mt-1">87 hrs</div>
              <div className="text-xs text-purple-600 font-bold mt-1">39 successful sessions</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-card">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">CO2 Saved (Smart Routing)</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">14.8 kg</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Zero roaming time spent searching</div>
            </div>
          </div>

          {/* Monthly Spend Visual Chart */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Monthly Parking Expenditure (₹)</h3>
                <p className="text-xs text-slate-500">Historical billing across all smart mobility sessions</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_SPEND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1rem',
                      border: '1px solid #E9D5FF',
                      boxShadow: '0 8px 30px rgba(99,102,241,0.1)'
                    }}
                  />
                  <Bar dataKey="spend" fill="#7C3AED" radius={[8, 8, 0, 0]} name="Spend (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
