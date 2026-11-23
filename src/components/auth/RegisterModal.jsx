import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OtpVerificationModal } from './OtpVerificationModal';
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Car,
  Bike,
  Zap,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Camera
} from 'lucide-react';

export const RegisterModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    registerUser,
    showToast
  } = useApp();

  // Wizard Steps: 1 = Personal Details, 2 = Vehicle Details
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Details State
  const [personalData, setPersonalData] = useState({
    name: 'Rohit Sharma',
    email: 'rohit.sharma@example.com',
    phone: '+91 98765 43210',
    aadhaar: '5489 1234 5678',
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);

  // Step 2: Vehicle Details State
  const [vehicleData, setVehicleData] = useState({
    type: 'car', // 'car' | 'bike' | 'ev'
    modelName: 'Hyundai Creta SX',
    plateNumber: 'KA 03 MG 7821',
    licenseImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    insuranceNumber: 'HDFC-ERGO-884920',
  });

  const [licensePreview, setLicensePreview] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );

  // Active OTP Modal Trigger
  const [otpModalConfig, setOtpModalConfig] = useState({
    isOpen: false,
    targetType: 'phone', // 'phone' | 'aadhaar'
    targetValue: '',
  });

  const [validationError, setValidationError] = useState('');

  if (!isAuthModalOpen) return null;

  // Aadhaar auto-formatting (adds spaces every 4 digits)
  const handleAadhaarChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    let formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setPersonalData({ ...personalData, aadhaar: formatted });
    setIsAadhaarVerified(false);
    setValidationError('');
  };

  const handlePhoneChange = (e) => {
    setPersonalData({ ...personalData, phone: e.target.value });
    setIsPhoneVerified(false);
    setValidationError('');
  };

  // Open OTP verification for Phone
  const triggerPhoneOtp = () => {
    if (!personalData.phone || personalData.phone.length < 10) {
      setValidationError('Please enter a valid phone number first');
      return;
    }
    setValidationError('');
    setOtpModalConfig({
      isOpen: true,
      targetType: 'phone',
      targetValue: personalData.phone,
    });
  };

  // Open OTP verification for Aadhaar
  const triggerAadhaarOtp = () => {
    const rawAadhaar = personalData.aadhaar.replace(/\s/g, '');
    if (rawAadhaar.length !== 12) {
      setValidationError('Please enter a valid 12-digit Aadhaar Card number');
      return;
    }
    setValidationError('');
    setOtpModalConfig({
      isOpen: true,
      targetType: 'aadhaar',
      targetValue: personalData.aadhaar,
    });
  };

  const handleOtpSuccess = () => {
    if (otpModalConfig.targetType === 'phone') {
      setIsPhoneVerified(true);
      showToast('Phone number verified successfully!', 'success');
    } else {
      setIsAadhaarVerified(true);
      showToast('UIDAI Aadhaar verified successfully!', 'success');
    }
  };

  // Validate Step 1 and proceed to Step 2
  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    if (!personalData.name.trim()) {
      setValidationError('Please enter your full name');
      return;
    }
    if (!personalData.email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    if (!isPhoneVerified) {
      setValidationError('Please verify your Phone Number with OTP before continuing');
      return;
    }
    if (!isAadhaarVerified) {
      setValidationError('Please verify your Aadhaar Card with OTP before continuing');
      return;
    }

    setValidationError('');
    setCurrentStep(2);
  };

  // Handle License image upload simulation
  const handleLicenseUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLicensePreview(event.target.result);
        setVehicleData({ ...vehicleData, licenseImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit full registration
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!vehicleData.plateNumber.trim()) {
      setValidationError('Please enter the vehicle number plate');
      return;
    }
    if (!licensePreview) {
      setValidationError('Please upload a vehicle driving license image');
      return;
    }

    registerUser(personalData, vehicleData);
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Title & Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-extrabold uppercase tracking-wide">
                Slot Seeker Onboarding
              </span>
              <span className="text-xs font-bold text-slate-400">Step {currentStep} of 2</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {currentStep === 1 ? 'Personal Details & Verification' : 'Vehicle Registration Details'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {currentStep === 1
                ? 'Register with your verified phone and UIDAI Aadhaar number to secure parking slots.'
                : 'Add your primary vehicle info, plate number, and driver license.'}
            </p>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-gradient-to-r from-myspot-700 to-indigo-600' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === 2 ? 'bg-gradient-to-r from-myspot-700 to-indigo-600' : 'bg-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Validation Banner */}
          {validationError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={personalData.name}
                    onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                    placeholder="e.g. Rohit Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    placeholder="rohit@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Phone Number + OTP Verification */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone Number (Verify with OTP)</label>
                  {isPhoneVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Phone Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={personalData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={triggerPhoneOtp}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                      isPhoneVerified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300'
                    }`}
                  >
                    {isPhoneVerified ? 'Re-verify' : 'Verify OTP'}
                  </button>
                </div>
              </div>

              {/* Aadhaar Card Number + OTP Verification */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Aadhaar Card Number (Verify with OTP)</label>
                  {isAadhaarVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> UIDAI Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={personalData.aadhaar}
                      onChange={handleAadhaarChange}
                      placeholder="5489 1234 5678"
                      maxLength={14}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all tracking-wider"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={triggerAadhaarOtp}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                      isAadhaarVerified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300'
                    }`}
                  >
                    {isAadhaarVerified ? 'Re-verify' : 'Verify OTP'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  12-digit Aadhaar UID used for seamless boom barrier pass authentication.
                </p>
              </div>

              {/* Continue to Vehicle Step button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue to Vehicle Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VEHICLE REGISTRATION */}
          {currentStep === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {/* Vehicle Type Selector (Car / Bike / EV) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Vehicle Type</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'car', label: 'Car / Sedan', icon: Car, emoji: '🚗' },
                    { id: 'bike', label: 'Motorbike / Scooter', icon: Bike, emoji: '🏍️' },
                    { id: 'ev', label: 'Electric EV', icon: Zap, emoji: '⚡' },
                  ].map((v) => {
                    const isSelected = vehicleData.type === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVehicleData({ ...vehicleData, type: v.id })}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all text-center ${
                          isSelected
                            ? 'border-myspot-600 bg-purple-50 text-myspot-900 shadow-sm'
                            : 'border-slate-200 hover:border-purple-200 text-slate-600 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{v.emoji}</span>
                        <span className="text-xs font-extrabold">{v.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vehicle Number Plate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Vehicle Number Plate (Registration No.)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={vehicleData.plateNumber}
                    onChange={(e) => setVehicleData({ ...vehicleData, plateNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. KA 03 MG 7821"
                    className="w-full uppercase px-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-mono font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white tracking-widest"
                  />
                </div>
              </div>

              {/* Vehicle License Image Upload / Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Vehicle Driving License Image
                </label>
                <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-3.5 bg-purple-50/30 text-center transition-colors">
                  {licensePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={licensePreview}
                        alt="License Preview"
                        className="w-20 h-14 rounded-xl object-cover border border-purple-200 shadow-sm"
                      />
                      <div className="text-left flex-1">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> License Document Attached
                        </span>
                        <p className="text-[10px] text-slate-500">Click to change document</p>
                      </div>
                      <label className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 text-xs font-bold hover:bg-purple-200 cursor-pointer">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLicenseUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                      <span className="text-xs font-bold text-purple-800">Upload License Image</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or PDF up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLicenseUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Vehicle Insurance (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Vehicle Insurance Policy (Optional)</label>
                  <span className="text-[10px] text-slate-400 font-semibold">Optional</span>
                </div>
                <div className="relative">
                  <FileCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={vehicleData.insuranceNumber}
                    onChange={(e) => setVehicleData({ ...vehicleData, insuranceNumber: e.target.value })}
                    placeholder="e.g. HDFC-ERGO-884920"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Complete & Start Booking</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-5 pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => {
                setIsPhoneVerified(true);
                setIsAadhaarVerified(true);
                showToast('Demo credentials & OTP pre-verified for fast review!', 'success');
              }}
              className="text-purple-700 font-bold hover:underline"
            >
              Pre-verify Demo Account
            </button>
          </div>
        </div>
      </div>

      {/* Embedded OTP Modal */}
      <OtpVerificationModal
        isOpen={otpModalConfig.isOpen}
        onClose={() => setOtpModalConfig({ ...otpModalConfig, isOpen: false })}
        targetType={otpModalConfig.targetType}
        targetValue={otpModalConfig.targetValue}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
};
