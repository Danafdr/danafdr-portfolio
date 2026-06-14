'use client';

import type { Metadata } from "next";
import Header from "../../components/Header";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="bg-paper min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-1 flex flex-col justify-center px-10 py-20 max-w-5xl mx-auto w-full">
        <h1 className="font-playfair text-[60px] md:text-[90px] lg:text-[120px] font-black leading-[0.87] tracking-[-0.03em] mb-16">
          Let&apos;s make<br />
          something<br />
          <em className="italic font-normal text-ink2">real.</em>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-20">
          <div>
            <p className="font-playfair italic text-[16px] text-ink2 leading-[1.7]">
              Open to web dev freelance, video editing work, internships, and anything genuinely interesting. I bring both the code and the visual eye — full creative partner, not just a dev.
            </p>

            <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-4 max-w-[400px]">
              <input 
                type="text" 
                placeholder="Name" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-transparent border-b border-border-rgba py-2 px-1 text-[13px] text-ink placeholder:text-ink3 focus:outline-none focus:border-accent transition-colors"
              />
              <input 
                type="email" 
                placeholder="Email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent border-b border-border-rgba py-2 px-1 text-[13px] text-ink placeholder:text-ink3 focus:outline-none focus:border-accent transition-colors"
              />
              <textarea 
                placeholder="Message" 
                required
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="bg-transparent border-b border-border-rgba py-2 px-1 text-[13px] text-ink placeholder:text-ink3 focus:outline-none focus:border-accent transition-colors resize-none mt-2"
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="mt-4 self-start font-mono text-[9px] uppercase tracking-[0.18em] border border-border-rgba px-6 py-3 hover:text-accent hover:border-accent transition-colors disabled:opacity-50 cursor-pointer"
              >
                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
              </button>
              {status === 'error' && <p className="text-red-500 text-[10px] mt-2">Failed to send message. Try again.</p>}
            </form>
          </div>
          
          <div className="flex flex-col gap-0 border-t border-border-rgba">
            <Link href="https://github.com/danafdr" target="_blank" className="flex items-center gap-4 py-6 border-b border-border-rgba cursor-pointer group no-underline">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[100px]">GitHub</span>
              <span className="text-[15px] text-ink transition-colors duration-200 tracking-[0.02em] group-hover:text-accent">github.com/danafdr</span>
              <span className="ml-auto text-[14px] text-ink3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
            </Link>
            
            <Link href="https://instagram.com/danafdr_" target="_blank" className="flex items-center gap-4 py-6 border-b border-border-rgba cursor-pointer group no-underline">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[100px]">Instagram</span>
              <span className="text-[15px] text-ink transition-colors duration-200 tracking-[0.02em] group-hover:text-accent">@danafdr_</span>
              <span className="ml-auto text-[14px] text-ink3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
            </Link>
            
            <div className="flex items-center gap-4 py-6 border-b border-border-rgba cursor-pointer group">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[100px]">Location</span>
              <span className="text-[15px] text-ink transition-colors duration-200 tracking-[0.02em] group-hover:text-accent">West Jakarta, Indonesia</span>
              <span className="ml-auto text-[14px] text-ink3">·</span>
            </div>
            
            <div className="flex items-center gap-4 py-6 border-b border-border-rgba cursor-pointer group">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[100px]">Status</span>
              <span className="text-[15px] text-accent transition-colors duration-200 tracking-[0.02em] group-hover:text-accent">Available for work</span>
              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pd ml-auto"></div>
            </div>
            
            <div className="flex items-center gap-4 py-6 border-b border-border-rgba cursor-pointer group">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[100px]">Open to</span>
              <span className="text-[15px] text-ink transition-colors duration-200 tracking-[0.02em] group-hover:text-accent">Freelance · Collabs · Internships</span>
            </div>
          </div>
        </div>
      </section>
      
      <div className="px-10 py-6 border-t border-border-rgba flex justify-between text-[9px] text-ink3 tracking-[0.14em] uppercase">
        <span>danafdr · West Jakarta · 2025</span>
        <span>Boys Don&apos;t Cry energy · web-first · no templates ever</span>
      </div>
    </main>
  );
}
