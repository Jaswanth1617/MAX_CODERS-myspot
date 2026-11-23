import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, KeyRound, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OtpVerificationModal = ({
  isOpen,
  onClose,
  targetType, // 'phone' | 'aadhaar'
  targetValue,
  onSuccess
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(30);
      setError('');
      setIsSuccess(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const digits = pasted.split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      if (digits.length === 6) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate OTP verification API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }, 800);
  };

  const isPhone = targetType === 'phone';

  return (
    <div className="fixed inset-0 z-[1100] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-myspot-700 to-indigo-600 flex items-center justify-center text-white shadow-glow">
            {isPhone ? <ShieldCheck className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {isPhone ? 'Verify Mobile Number' : 'UIDAI Aadhaar OTP Verification'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            We sent a 6-digit verification code to
          </p>
          <p className="font-mono font-bold text-sm text-myspot-900 mt-0.5">
            {isPhone ? targetValue : `Aadhaar XXXX-XXXX-${(targetValue || '1234').slice(-4)}`}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-5" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-extrabold rounded-2xl border-2 transition-all focus:outline-none ${
                error
                  ? 'border-red-400 bg-red-50/40 text-red-900'
                  : digit
                  ? 'border-myspot-600 bg-purple-50/50 text-myspot-900 shadow-sm'
                  : 'border-slate-200 focus:border-myspot-500 focus:ring-4 focus:ring-purple-100'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs font-semibold text-red-600 mb-4">{error}</p>
        )}

        {isSuccess && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 mb-4 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verification Successful!</span>
          </div>
        )}

        {/* Auto Fill Demo Code Button */}
        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={fillDemoOtp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100/70 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all border border-purple-200 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Auto-fill Demo Code (123456)</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || isSuccess}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-glow transition-all disabled:opacity-50"
        >
          {isVerifying ? 'Verifying OTP...' : isSuccess ? 'Verified!' : 'Confirm & Verify'}
        </button>

        {/* Resend Timer */}
        <div className="text-center mt-4 text-xs text-slate-500">
          {timeLeft > 0 ? (
            <span>Resend OTP in <strong className="text-purple-700 font-bold">{timeLeft}s</strong></span>
          ) : (
            <button
              onClick={() => {
                setTimeLeft(30);
                fillDemoOtp();
              }}
              className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Resend OTP Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
