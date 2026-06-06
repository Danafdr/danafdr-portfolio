import React from 'react';
import { AdminButton } from './AdminButton';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,14,11,0.88)] backdrop-blur-sm animate-fi">
      <div className="bg-bg2 border border-border w-full max-w-[360px] p-8 shadow-2xl">
        <h3 className="font-playfair italic text-[22px] text-admin-ink mb-2">{title}</h3>
        <p className="font-mono text-[11px] text-admin-ink2 mb-8">{message}</p>
        
        <div className="flex justify-end gap-3">
          <AdminButton variant="ghost" onClick={onCancel}>{cancelText}</AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>{confirmText}</AdminButton>
        </div>
      </div>
    </div>
  );
}
