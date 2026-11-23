import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Car, Bike, Zap, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewVehicleModal = () => {
  const { isNewVehicleModalOpen, setIsNewVehicleModalOpen, addVehicle } = useApp();

  const [formData, setFormData] = useState({
    type: 'car',
    modelName: '',
    plateNumber: '',
    licenseImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    insuranceNumber: '',
  });

  const [licensePreview, setLicensePreview] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80'
  );
  const [error, setError] = useState('');

  if (!isNewVehicleModalOpen) return null;

  const handleLicenseUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLicensePreview(event.target.result);
        setFormData({ ...formData, licenseImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plateNumber.trim()) {
      setError('Please enter vehicle number plate');
      return;
    }
    setError('');
    addVehicle(formData);
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsNewVehicleModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 shadow-sm">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Add New Vehicle</h3>
          <p className="text-xs text-slate-500">Register a new car, bike or EV to your myspot account.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-xs font-bold text-red-700 flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'car', label: 'Car', emoji: '🚗' },
                { id: 'bike', label: 'Bike', emoji: '🏍️' },
                { id: 'ev', label: 'EV', emoji: '⚡' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t.id })}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    formData.type === t.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Model Name (e.g. Honda City / Activa)</label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
              placeholder="e.g. Tata Nexon EV"
              className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Vehicle Number Plate</label>
            <input
              type="text"
              required
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
              placeholder="e.g. DL 08 CB 4321"
              className="w-full uppercase px-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-mono font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white tracking-widest"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">License Document Image</label>
            <div className="border-2 border-dashed border-purple-200 rounded-2xl p-3 bg-purple-50/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <img
                  src={licensePreview}
                  alt="License"
                  className="w-12 h-9 rounded-lg object-cover border border-purple-200"
                />
                <span className="text-xs font-bold text-slate-700">License Document</span>
              </div>
              <label className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold cursor-pointer">
                Upload New
                <input type="file" accept="image/*" onChange={handleLicenseUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Insurance Policy (Optional)</label>
            <input
              type="text"
              value={formData.insuranceNumber}
              onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
              placeholder="e.g. BAJAJ-ALLIANZ-77123"
              className="w-full px-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow transition-all"
          >
            Add Vehicle to Profile
          </button>
        </form>
      </div>
    </div>
  );
};
