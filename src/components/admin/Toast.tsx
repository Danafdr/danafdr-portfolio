'use client';
import { useEffect, useState } from 'react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toasts: ToastItem[];
}

export function Toast({ toasts }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-bg2 border border-border p-4 shadow-lg flex items-center gap-3 transform transition-all duration-250 animate-fi
            ${toast.type === 'success' ? 'border-l-2 border-l-accent' : 'border-l-2 border-l-[#c8441a]'}`}
        >
          <p className="font-mono text-[11px] text-admin-ink">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

// Simple event-based toast manager
let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let currentToasts: ToastItem[] = [];

export const toast = (message: string, type: 'success' | 'error' = 'success') => {
  const id = Math.random().toString(36).substr(2, 9);
  currentToasts = [...currentToasts, { id, message, type }].slice(-3);
  toastListeners.forEach((l) => l(currentToasts));

  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(currentToasts));
  }, 3000);
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  return <Toast toasts={toasts} />;
}
