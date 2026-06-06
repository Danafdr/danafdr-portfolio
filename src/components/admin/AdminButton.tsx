import React, { ButtonHTMLAttributes } from 'react';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

export function AdminButton({ variant = 'primary', className = '', ...props }: AdminButtonProps) {
  const baseClasses = "font-mono px-4 py-2 transition-all flex items-center justify-center rounded-none shadow-none";
  
  const variants = {
    primary: "btn-primary text-[11px] uppercase tracking-[0.1em] disabled:opacity-35 disabled:pointer-events-none",
    ghost: "btn-ghost disabled:opacity-35 disabled:pointer-events-none text-[11px] uppercase tracking-[0.1em]",
    danger: "bg-transparent border border-[rgba(200,68,26,0.3)] text-accent hover:bg-[rgba(200,68,26,0.06)] disabled:opacity-35 disabled:pointer-events-none text-[11px]",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props} />
  );
}
