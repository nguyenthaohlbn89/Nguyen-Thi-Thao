import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export type ToastItem = ToastMessage;

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss, onRemove }) => {
  const dismiss = onRemove || onDismiss || (() => {});

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dismiss(toasts[0].id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500'
              : toast.type === 'warning'
              ? 'bg-amber-600 text-white border-amber-500'
              : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-rose-200" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 shrink-0 text-amber-200" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-sky-200" />}
            <span className="text-sm font-medium leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-white/70 hover:text-white ml-2 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const ToastContainer = Toast;
