import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'warning' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#55735B] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#C48A4A] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#5B7E86] shrink-0" />
  };

  const borderMap = {
    success: 'border-[#55735B]',
    warning: 'border-[#C48A4A]',
    info: 'border-[#5B7E86]'
  };

  const type = toast.type || 'success';

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-[400px] mx-auto animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`bg-[#1C201C] border-l-4 ${borderMap[type]} border-y border-r border-[#34332D] p-3.5 rounded-xl shadow-2xl flex items-start gap-3`}>
        {iconMap[type]}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-[#F1E8DC]">{toast.title}</h4>
          {toast.message && (
            <p className="text-[11px] text-[#C2B3A0] mt-0.5 leading-snug">{toast.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#918577] hover:text-[#F1E8DC] p-1 rounded-md"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
