import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isWarning = toastMessage.type === 'warning';

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-[1200] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-card border backdrop-blur-md text-sm font-semibold max-w-md ${
          isSuccess
            ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40 shadow-emerald-900/20'
            : isWarning
            ? 'bg-amber-950/90 text-amber-100 border-amber-500/40 shadow-amber-900/20'
            : 'bg-slate-900/90 text-white border-purple-500/40 shadow-purple-900/20'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        {!isSuccess && !isWarning && <Info className="w-5 h-5 text-purple-400 shrink-0" />}

        <p className="leading-snug">{toastMessage.message}</p>
      </div>
    </div>
  );
};
