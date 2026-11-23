import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  Upload,
  MapPin,
  Car,
  Bike,
  Zap,
  Video,
  ShieldCheck,
  CheckCircle2,
  Compass,
  FileCheck,
  Plus
} from 'lucide-react';

export const AddNewSpaceModal = () => {
  const { isAddNewSpaceModalOpen, setIsAddNewSpaceModalOpen, addNewHostSpace, userLocation, requestUserLocation, isLocating } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    address: userLocation?.address || '100 Feet Road, Indiranagar, Bengaluru',
    lat: userLocation?.lat || 12.9716,
    lng: userLocation?.lng || 77.5946,
    totalSlots: 6,
    pricePerHour: 40,
    allowedVehicles: ['car', 'bike'],
    hasCctvSubscription: true,
    hasEvCharging: false,
    isCovered: true,
    landPhotoProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    slotPhoto: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
  });

  const [deedPreview, setDeedPreview] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );
  const [slotPreview, setSlotPreview] = useState(
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
  );
  const [error, setError] = useState('');

  if (!isAddNewSpaceModalOpen) return null;

  const handleDeedUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDeedPreview(event.target.result);
        setFormData({ ...formData, landPhotoProof: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlotPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSlotPreview(event.target.result);
        setFormData({ ...formData, slotPhoto: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter a parking space name');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter the parking location address');
      return;
    }

    addNewHostSpace(formData);
  };

  return (
    <div className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setIsAddNewSpaceModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center mb-2 shadow-glow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">List New Parking Space</h3>
          <p className="text-xs text-slate-500">
            Register your empty land, driveway, or commercial parking lot to earn passive revenue.
          </p>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-4 pr-1">
          {/* Space Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Space Name / Building Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Arcade Open Ground Parking"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Location & GPS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Land Location & Address</label>
              <button
                type="button"
                onClick={requestUserLocation}
                disabled={isLocating}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>Fetch Current GPS</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full landmark, road and area address..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Capacity & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Bays / Slots</label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.totalSlots}
                onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price per Hour (₹)</label>
              <input
                type="number"
                min={10}
                max={500}
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Land Photo Proof & Real Slot Photo Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Deed Proof */}
            <div className="border-2 border-dashed border-purple-200 rounded-2xl p-3 bg-purple-50/30">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">1. Land Deed Ownership Proof</span>
              <img
                src={deedPreview}
                alt="Deed Preview"
                className="w-full h-24 rounded-xl object-cover border border-purple-200 mb-2"
              />
              <label className="block w-full py-1.5 px-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-center text-[11px] font-bold rounded-xl cursor-pointer">
                Upload Deed
                <input type="file" accept="image/*" onChange={handleDeedUpload} className="hidden" />
              </label>
            </div>

            {/* Slot Photo */}
            <div className="border-2 border-dashed border-purple-200 rounded-2xl p-3 bg-purple-50/30">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">2. Land Slot Space Photo</span>
              <img
                src={slotPreview}
                alt="Slot Preview"
                className="w-full h-24 rounded-xl object-cover border border-purple-200 mb-2"
              />
              <label className="block w-full py-1.5 px-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-center text-[11px] font-bold rounded-xl cursor-pointer">
                Upload Space Photo
                <input type="file" accept="image/*" onChange={handleSlotPhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* CCTV Installation Subscription Option */}
          <div
            onClick={() => setFormData({ ...formData, hasCctvSubscription: !formData.hasCctvSubscription })}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              formData.hasCctvSubscription
                ? 'border-purple-600 bg-purple-50/80 shadow-xs'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>myspot AI CCTV Security Kit Subscription</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Free HD camera installation, 24/7 AI license plate scanning & insurance backing
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.hasCctvSubscription}
                onChange={() => {}}
                className="w-4 h-4 text-purple-600 rounded mt-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Space Live to Slot Seekers</span>
          </button>
        </form>
      </div>
    </div>
  );
};
