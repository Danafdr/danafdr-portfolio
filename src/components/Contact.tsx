'use client';

import { useState, useEffect } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [availableForWork, setAvailableForWork] = useState(true);

  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then(data => {
        if (data && data.available_for_work !== undefined) {
          setAvailableForWork(data.available_for_work);
        }
      })
      .catch(() => {});
  }, []);

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
    <section id="contact" className="pt-16 px-6 md:px-10 pb-[72px] reveal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-start">
        <div>
          <h2 className="font-playfair text-[clamp(48px,7.5vw,76px)] font-black leading-[0.87] tracking-[-0.03em]">
            Let&apos;s make<br />
            something<br />
            <em className="italic font-normal text-ink2">real.</em>
          </h2>
          <p className="font-playfair italic text-[14px] text-ink2 mt-[22px] leading-[1.65] max-w-[400px]">
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
              className="mt-4 self-start font-mono text-[9px] uppercase tracking-[0.18em] border border-border-rgba px-6 py-3 hover:text-accent hover:border-accent transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
            </button>
            {status === 'error' && <p className="text-red-500 text-[10px] mt-2">Failed to send message. Try again.</p>}
          </form>
        </div>
        
        <div>
          <div className="flex flex-col gap-0">
            <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba cursor-pointer group hover:bg-[rgba(255,255,255,0.02)] transition-colors" onClick={() => window.open('https://github.com/danafdr', '_blank')}>
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">GitHub</span>
              <span className="text-[13px] text-ink transition-colors duration-200 tracking-[0.02em]">github.com/danafdr</span>
              <span className="md:ml-auto text-[12px] text-ink3 hidden md:block">↗</span>
            </div>
            <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba cursor-pointer group hover:bg-[rgba(255,255,255,0.02)] transition-colors" onClick={() => window.open('https://instagram.com/danafdr_', '_blank')}>
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">Instagram</span>
              <span className="text-[13px] text-ink transition-colors duration-200 tracking-[0.02em]">@danafdr_</span>
              <span className="md:ml-auto text-[12px] text-ink3 hidden md:block">↗</span>
            </div>
            <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba cursor-pointer group hover:bg-[rgba(255,255,255,0.02)] transition-colors" onClick={() => window.open('https://tiktok.com/@danafdr_', '_blank')}>
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">TikTok</span>
              <span className="text-[13px] text-ink transition-colors duration-200 tracking-[0.02em]">@danafdr_</span>
              <span className="md:ml-auto text-[12px] text-ink3 hidden md:block">↗</span>
            </div>
            <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba cursor-pointer group hover:bg-[rgba(255,255,255,0.02)] transition-colors" onClick={() => window.open('https://youtube.com/@danafdr', '_blank')}>
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">YouTube</span>
              <span className="text-[13px] text-ink transition-colors duration-200 tracking-[0.02em]">@danafdr</span>
              <span className="md:ml-auto text-[12px] text-ink3 hidden md:block">↗</span>
            </div>
            <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">Location</span>
              <span className="text-[13px] text-ink transition-colors duration-200 tracking-[0.02em]">West Jakarta, Indonesia</span>
              <span className="md:ml-auto text-[12px] text-ink3 hidden md:block">·</span>
            </div>
            {availableForWork && (
              <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba">
                <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">Status</span>
                <span className="text-[13px] text-accent transition-colors duration-200 tracking-[0.02em]">Available for work</span>
                <div className="w-[5px] h-[5px] rounded-full bg-accent shrink-0 animate-pd hidden md:block md:ml-auto"></div>
              </div>
            )}
            <div className="c-row flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-[15px] px-2 -mx-2 border-b border-border-rgba cursor-pointer group">
              <span className="text-[9px] text-ink3 tracking-[0.18em] uppercase min-w-[80px]">Open to</span>
              <span className="text-[13px] text-ink transition-colors duration-200 tracking-[0.02em]">Freelance · Collabs · Internships</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[52px] pt-[18px] border-t border-border-rgba flex flex-col md:flex-row justify-between gap-4 text-[9px] text-ink3 tracking-[0.14em] uppercase">
        <div className="flex flex-wrap gap-4 md:gap-6">
          <span>danafdr · West Jakarta · 2025</span>
          <a href="/photography" className="hover:text-ink transition-colors">Photography ↗</a>
        </div>
        <span>Boys Don&apos;t Cry energy · web-first · no templates ever</span>
      </div>
    </section>
  );
}
