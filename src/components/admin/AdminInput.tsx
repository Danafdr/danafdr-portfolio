import React, { InputHTMLAttributes } from 'react';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AdminInput({ label, error, className = '', ...props }: AdminInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-admin-ink2">
        {label}
      </label>
      <input
        className={`w-full bg-bg2 text-admin-ink border ${error ? 'border-accent' : 'border-border'} px-[14px] py-[10px] font-mono text-[12px] focus:border-accent focus:outline-none transition-colors`}
        {...props}
      />
      {error && <span className="font-mono text-[10px] text-accent">{error}</span>}
    </div>
  );
}
