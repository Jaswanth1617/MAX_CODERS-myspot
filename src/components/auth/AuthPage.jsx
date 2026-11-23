import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OtpVerificationModal } from './OtpVerificationModal';
import { INITIAL_USER } from '../../data/mockData';
import {
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
  Lock,
  MapPin,
  Clock,
  Compass,
  Building2,
  Video,
  Plus,
  Layers,
  ArrowLeft
} from 'lucide-react';

export const AuthPage = () => {
  const {
    registerUser,
    registerOwner,
    setUser,
    setActiveRole,
    userLocation,
    requestUserLocation,
    isLocating,
    showToast
  } = useApp();

  // Role Selection: 'seeker' (Slot Seeker) | 'owner' (Slot Seller / Host)
  const [selectedRole, setSelectedRole] = useState('seeker');

  // Mode: 'register' | 'login'
  const [authMode, setAuthMode] = useState('register');

  // Wizard Steps (1 or 2)
  const [wizardStep, setWizardStep] = useState(1);

  // 1. Personal Details State (Shared by Seeker & Owner)
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaar: '',
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);

  // 2. Seeker Vehicle Details State (Step 2 for Seeker)
  const [vehicleData, setVehicleData] = useState({
    type: 'car',
    modelName: 'Hyundai Creta',
    plateNumber: '',
    licenseImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    insuranceNumber: '',
  });

  const [licensePreview, setLicensePreview] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );

  // 3. Owner Land Verification Details State (Step 2 for Owner)
  const [landData, setLandData] = useState({
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
  const [slotPhotoPreview, setSlotPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
  );

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);

  // OTP Modal Config
  const [otpModalConfig, setOtpModalConfig] = useState({
    isOpen: false,
    targetType: 'phone',
    targetValue: '',
  });

  const [validationError, setValidationError] = useState('');

  // Handle Aadhaar formatting (12 digits with spaces)
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

  const triggerPhoneOtp = () => {
    if (!personalData.phone || personalData.phone.length < 10) {
      setValidationError('Please enter a valid 10-digit phone number first');
      return;
    }
    setValidationError('');
    setOtpModalConfig({
      isOpen: true,
      targetType: 'phone',
      targetValue: personalData.phone,
    });
  };

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
      showToast('Phone number verified with OTP!', 'success');
    } else {
      setIsAadhaarVerified(true);
      showToast('UIDAI Aadhaar verified with OTP!', 'success');
    }
  };

  // Validate Step 1 (Personal Details) and Proceed to Step 2
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
    setWizardStep(2);
  };

  // License upload for Seeker
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

  // Deed proof upload for Owner
  const handleDeedUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDeedPreview(event.target.result);
        setLandData({ ...landData, landPhotoProof: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Slot photo upload for Owner
  const handleSlotPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSlotPhotoPreview(event.target.result);
        setLandData({ ...landData, slotPhoto: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Final submit for Seeker
  const handleFinalSeekerRegister = (e) => {
    e.preventDefault();
    if (!vehicleData.plateNumber.trim()) {
      setValidationError('Please enter your vehicle number plate');
      return;
    }
    if (!licensePreview) {
      setValidationError('Please upload your driving license image');
      return;
    }
    registerUser(personalData, vehicleData);
  };

  // Final submit for Owner
  const handleFinalOwnerRegister = (e) => {
    e.preventDefault();
    if (!landData.name.trim()) {
      setValidationError('Please enter your parking space / land name');
      return;
    }
    if (!landData.address.trim()) {
      setValidationError('Please enter the land address');
      return;
    }
    registerOwner(personalData, landData);
  };

  // Fast Demo Logins
  const handleQuickLoginSeeker = () => {
    setUser(INITIAL_USER);
    setActiveRole('seeker');
    showToast(`Welcome back, ${INITIAL_USER.name}!`, 'success');
  };

  const handleQuickLoginOwner = () => {
    const demoOwner = {
      id: 'host_demo_1',
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@myspot.app',
      phone: '+91 98450 99887',
      isPhoneVerified: true,
      aadhaar: '5489 9876 5432',
      isAadhaarVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'owner',
      payoutUpi: '9845099887@okaxis',
      bankAccount: 'HDFC0001842 •••• 7892',
      cctvSubscriptionActive: true,
      cctvPlanName: 'myspot AI Smart Sentinel 24/7'
    };
    setUser(demoOwner);
    setActiveRole('owner');
    showToast(`Welcome back to Host Portal, ${demoOwner.name}!`, 'success');
  };

  // Auto-fill demo credentials
  const fillDemoSeekerData = () => {
    setPersonalData({
      name: 'Rohit Sharma',
      email: 'rohit.sharma@myspot.app',
      phone: '+91 98765 43210',
      aadhaar: '5489 1234 5678',
    });
    setIsPhoneVerified(true);
    setIsAadhaarVerified(true);
    setVehicleData({
      type: 'car',
      modelName: 'Hyundai Creta SX',
      plateNumber: 'KA 03 MG 7821',
      licenseImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      insuranceNumber: 'HDFC-ERGO-884920',
    });
    setValidationError('');
    showToast('Seeker demo credentials auto-filled & verified!', 'info');
  };

  const fillDemoOwnerData = () => {
    setPersonalData({
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@myspot.app',
      phone: '+91 98450 99887',
      aadhaar: '5489 9876 5432',
    });
    setIsPhoneVerified(true);
    setIsAadhaarVerified(true);
    setLandData({
      name: 'Cyber Arcade Smart Land Parking',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru',
      lat: 12.9716,
      lng: 77.5946,
      totalSlots: 8,
      pricePerHour: 50,
      allowedVehicles: ['car', 'bike'],
      hasCctvSubscription: true,
      hasEvCharging: true,
      isCovered: true,
      landPhotoProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      slotPhoto: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
    });
    setValidationError('');
    showToast('Owner & Land details auto-filled & verified!', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center text-white font-black text-2xl shadow-glow">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
                myspot
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Smart Mobility
              </span>
            </div>
            <p className="text-xs text-purple-200/80 -mt-1 hidden sm:block">
              Smart Parking Reservation & Land Partner Portal
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="flex items-center gap-2">
          {selectedRole === 'seeker' ? (
            <button
              onClick={handleQuickLoginSeeker}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo Seeker Login</span>
            </button>
          ) : (
            <button
              onClick={handleQuickLoginOwner}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/60 to-teal-600/60 hover:opacity-90 border border-emerald-400/40 text-xs font-bold text-white transition-all backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo Host Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Authentication & Role Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-5xl">
          {/* Left Brand Teaser & Benefits */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-black border border-purple-400/30">
                {selectedRole === 'seeker' ? <Compass className="w-3.5 h-3.5 text-purple-300" /> : <Building2 className="w-3.5 h-3.5 text-emerald-300" />}
                <span>{selectedRole === 'seeker' ? 'Driver Mobility Portal' : 'Land Monetization Partner'}</span>
              </span>
              <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
                {selectedRole === 'seeker'
                  ? 'Park smarter, faster, and stress-free.'
                  : 'Turn empty land into recurring parking revenue.'}
              </h1>
              <p className="text-sm text-purple-200/80 leading-relaxed">
                {selectedRole === 'seeker'
                  ? 'Connect directly with nearby verified multi-level parking plazas, malls, and metro spots with instant digital QR passes.'
                  : 'Monetize driveways, vacant plots, and commercial parking bays with automated entry QR passes and 24/7 AI CCTV security.'}
              </p>
            </div>

            {/* Role Features Checklist */}
            <div className="space-y-3 pt-2">
              {selectedRole === 'seeker' ? (
                <>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Interactive 30% Dynamic Geolocation Map</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Instant Digital QR Entry Pass & Turn-by-Turn GPS</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Online UPI & Offline Cash at Bay Options</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Verified Land Ownership Proof & Auto-Publish</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>myspot 24/7 AI Smart CCTV Sentinel Subscription</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Real-Time Seeker Bookings, Approvals & Daily Payouts</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Authentication Card */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 relative">
            {/* Step 1: Initial Role Selection Cards (Seeker vs Slot Seller) */}
            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Select Your Purpose (Choose Role)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: Slot Seeker */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('seeker');
                    setWizardStep(1);
                    setValidationError('');
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    selectedRole === 'seeker'
                      ? 'border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-300'
                      : 'border-slate-200 hover:border-purple-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">🚗</span>
                    {selectedRole === 'seeker' && (
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Slot Seeker</span>
                    <span className="text-[10px] text-slate-500">I want to find & book parking</span>
                  </div>
                </button>

                {/* Option 2: Slot Seller / Host */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('owner');
                    setWizardStep(1);
                    setValidationError('');
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    selectedRole === 'owner'
                      ? 'border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-300'
                      : 'border-slate-200 hover:border-purple-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">🏢</span>
                    {selectedRole === 'owner' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Slot Seller (Host)</span>
                    <span className="text-[10px] text-slate-500">I want to list land & earn money</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-Header / Step Indicator */}
            <div className="mb-5 pb-3 border-b border-purple-50 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase">
                  {selectedRole === 'seeker' ? 'Slot Seeker Onboarding' : 'Host / Land Owner Onboarding'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {wizardStep === 1
                    ? '1. Personal Details & OTP Verification'
                    : selectedRole === 'seeker'
                    ? '2. Vehicle Registration Details'
                    : '2. Land Verification & Photo Proof'}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">Step {wizardStep} of 2</span>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  wizardStep >= 1 ? 'bg-gradient-to-r from-myspot-700 to-indigo-600' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  wizardStep === 2 ? 'bg-gradient-to-r from-myspot-700 to-indigo-600' : 'bg-slate-200'
                }`}
              />
            </div>

            {/* Validation Banner */}
            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: PERSONAL DETAILS (Seeker & Owner) */}
            {wizardStep === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={personalData.name}
                      onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                      placeholder={selectedRole === 'seeker' ? 'e.g. Rohit Sharma' : 'e.g. Vikramaditya Rao'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={personalData.email}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      placeholder={selectedRole === 'seeker' ? 'rohit@example.com' : 'host@myspot.app'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Phone Number + OTP Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                {/* Aadhaar UID + OTP Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-mono font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                </div>

                {/* Demo helper */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Testing credentials?</span>
                  <button
                    type="button"
                    onClick={selectedRole === 'seeker' ? fillDemoSeekerData : fillDemoOwnerData}
                    className="text-purple-700 font-bold hover:underline"
                  >
                    ⚡ Auto-fill Demo {selectedRole === 'seeker' ? 'Seeker' : 'Host'} Data
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
                >
                  <span>
                    Continue to {selectedRole === 'seeker' ? 'Vehicle Registration' : 'Land Verification'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: SEEKER VEHICLE DETAILS */}
            {wizardStep === 2 && selectedRole === 'seeker' && (
              <form onSubmit={handleFinalSeekerRegister} className="space-y-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'car', label: 'Car / Sedan', emoji: '🚗' },
                      { id: 'bike', label: 'Motorbike', emoji: '🏍️' },
                      { id: 'ev', label: 'Electric EV', emoji: '⚡' },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVehicleData({ ...vehicleData, type: v.id })}
                        className={`p-2.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                          vehicleData.type === v.id
                            ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xl block mb-0.5">{v.emoji}</span>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plate Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Number Plate (Registration No.)
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleData.plateNumber}
                    onChange={(e) => setVehicleData({ ...vehicleData, plateNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. KA 03 MG 7821"
                    className="w-full uppercase font-mono font-black px-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* License Document Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Driver's License Photo
                  </label>
                  <div className="border-2 border-dashed border-purple-200 rounded-2xl p-3 bg-purple-50/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={licensePreview}
                        alt="License"
                        className="w-14 h-10 rounded-xl object-cover border border-purple-200"
                      />
                      <span className="text-xs font-bold text-slate-700">Driving License Attached</span>
                    </div>
                    <label className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold cursor-pointer transition-colors">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleLicenseUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="w-1/3 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
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

            {/* STEP 2: OWNER LAND VERIFICATION & PHOTO PROOF */}
            {wizardStep === 2 && selectedRole === 'owner' && (
              <form onSubmit={handleFinalOwnerRegister} className="space-y-4 text-xs">
                {/* Land / Space Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parking Land / Space Name
                  </label>
                  <input
                    type="text"
                    required
                    value={landData.name}
                    onChange={(e) => setLandData({ ...landData, name: e.target.value })}
                    placeholder="e.g. Cyber Arcade Smart Land Parking"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Land Address & Live Location Pin */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Land Full Address & Live Location</label>
                    <button
                      type="button"
                      onClick={requestUserLocation}
                      disabled={isLocating}
                      className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                    >
                      <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>Pin GPS</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={landData.address}
                    onChange={(e) => setLandData({ ...landData, address: e.target.value })}
                    placeholder="100 Feet Road, Indiranagar, Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Capacity & Price per Hour */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Bays / Slots</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={landData.totalSlots}
                      onChange={(e) => setLandData({ ...landData, totalSlots: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price per Hour (₹)</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={landData.pricePerHour}
                      onChange={(e) => setLandData({ ...landData, pricePerHour: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Photo Proof Uploads (Land Deed + Real Slot Space) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Land Ownership Deed Proof */}
                  <div className="border-2 border-dashed border-purple-200 rounded-2xl p-3 bg-purple-50/30">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">
                      1. Land Photo Proof (Deed/Doc)
                    </span>
                    <img
                      src={deedPreview}
                      alt="Deed Proof"
                      className="w-full h-20 rounded-xl object-cover border border-purple-200 mb-1.5"
                    />
                    <label className="block w-full py-1 px-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-center text-[10px] font-bold rounded-xl cursor-pointer">
                      Upload Deed Proof
                      <input type="file" accept="image/*" onChange={handleDeedUpload} className="hidden" />
                    </label>
                  </div>

                  {/* 2. Real Slot Space Photo */}
                  <div className="border-2 border-dashed border-purple-200 rounded-2xl p-3 bg-purple-50/30">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">
                      2. Land Slot Space Photo
                    </span>
                    <img
                      src={slotPhotoPreview}
                      alt="Slot Photo"
                      className="w-full h-20 rounded-xl object-cover border border-purple-200 mb-1.5"
                    />
                    <label className="block w-full py-1 px-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-center text-[10px] font-bold rounded-xl cursor-pointer">
                      Upload Space Photo
                      <input type="file" accept="image/*" onChange={handleSlotPhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* CCTV Installation Subscription Checkbox */}
                <div
                  onClick={() => setLandData({ ...landData, hasCctvSubscription: !landData.hasCctvSubscription })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    landData.hasCctvSubscription
                      ? 'border-purple-600 bg-purple-50/80 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span>myspot AI Smart CCTV Security Kit Subscription</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Free HD Camera Installation • 24/7 AI Optical License Scanner • Insurance
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={landData.hasCctvSubscription}
                      onChange={() => {}}
                      className="w-4 h-4 text-purple-600 rounded mt-1 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="w-1/3 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Publish Land & Open Host Portal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-purple-200/60">
        myspot Smart Mobility • 256-bit SSL Encrypted • Built for Verified Drivers & Space Owners
      </footer>

      {/* Embedded OTP Modal */}
      <OtpVerificationModal
        isOpen={otpModalConfig.isOpen}
        onClose={() => setOtpModalConfig({ ...otpModalConfig, isOpen: false })}
        targetType={otpModalConfig.targetType}
        targetValue={otpModalConfig.targetValue}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
};
