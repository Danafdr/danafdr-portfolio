'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';
import { toast } from '@/components/admin/Toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [availableForWork, setAvailableForWork] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [userData, heroData] = await Promise.all([
        apiFetch('/api/admin/settings'),
        apiFetch('/api/hero'),
      ]);
      if (userData) {
        setEmail(userData.email || '');
        setGithubToken(userData.github_token || '');
        setAiApiKey(userData.ai_api_key || '');
      }
      if (heroData) {
        setAvailableForWork(heroData.available_for_work !== false);
      }
    } catch (e) {
      toast('Failed to fetch settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = { email, github_token: githubToken, ai_api_key: aiApiKey };
      if (password) payload.password = password;

      await apiFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      toast('Settings updated successfully!', 'success');
      setPassword(''); // clear password field after save
    } catch (e) {
      toast('Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    const newValue = !availableForWork;
    setAvailableForWork(newValue);
    setTogglingAvailability(true);
    try {
      await apiFetch('/api/admin/hero/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available_for_work: newValue }),
      });
      toast(newValue ? 'Status: Available for work' : 'Status: Not available', 'success');
    } catch (e) {
      setAvailableForWork(!newValue); // revert
      toast('Failed to update availability', 'error');
    } finally {
      setTogglingAvailability(false);
    }
  };

  if (loading) return <div className="p-12 text-[11px] uppercase tracking-widest text-admin-ink3 animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto select-text">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-playfair text-3xl mb-2 text-admin-ink">Settings</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-admin-ink2">Manage your account and integrations</p>
        </div>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </AdminButton>
      </div>

      <div className="flex flex-col gap-8">
        {/* Availability Toggle */}
        <section className="flex flex-col gap-4 border border-border p-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-admin-ink font-bold mb-2">Availability Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[12px] text-admin-ink">Available for Work</span>
              <span className="font-mono text-[9px] text-admin-ink3">
                {availableForWork 
                  ? 'Your portfolio shows "Available for work" to visitors.' 
                  : 'The availability badge is hidden from visitors.'}
              </span>
            </div>
            <button
              onClick={handleToggleAvailability}
              disabled={togglingAvailability}
              className={`w-12 h-6 rounded-full p-[3px] transition-colors duration-200 ${availableForWork ? 'bg-accent' : 'bg-admin-ink3'} ${togglingAvailability ? 'opacity-50' : ''}`}
            >
              <div className={`w-[18px] h-[18px] rounded-full bg-bg transition-transform duration-200 ${availableForWork ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className={`w-2 h-2 rounded-full ${availableForWork ? 'bg-accent animate-pulse' : 'bg-admin-ink3'}`} />
            <span className={`font-mono text-[10px] uppercase tracking-widest ${availableForWork ? 'text-accent' : 'text-admin-ink3'}`}>
              {availableForWork ? 'Currently Available' : 'Not Available'}
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-4 border border-border p-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-admin-ink font-bold mb-2">Account Details</h2>
          <AdminInput 
            label="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <AdminInput 
            label="New Password (leave blank to keep current)" 
            type="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </section>

        <section className="flex flex-col gap-4 border border-border p-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-admin-ink font-bold mb-2">Integrations</h2>
          
          <div className="flex flex-col gap-1">
            <AdminInput 
              label="GitHub Personal Access Token (PAT)" 
              type="password"
              value={githubToken} 
              onChange={e => setGithubToken(e.target.value)} 
            />
            <p className="text-[10px] text-admin-ink3 mt-1">Needed to easily import repositories into your projects.</p>
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <AdminInput 
              label="Google Gemini AI API Key" 
              type="password"
              value={aiApiKey} 
              onChange={e => setAiApiKey(e.target.value)} 
            />
            <p className="text-[10px] text-admin-ink3 mt-1">Needed to auto-generate magic descriptions for your projects.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
