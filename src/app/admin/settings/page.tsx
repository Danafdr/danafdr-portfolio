'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import { useToast } from '@/components/admin/Toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiFetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email || '');
        setGithubToken(data.github_token || '');
        setAiApiKey(data.ai_api_key || '');
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

      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast('Settings updated successfully!', 'success');
        setPassword(''); // clear password field after save
      } else {
        const err = await res.json();
        toast(err.error || 'Failed to update', 'error');
      }
    } catch (e) {
      toast('Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-[11px] uppercase tracking-widest text-admin-ink3 animate-pulse">Loading settings...</div>;

  return (
    <div className="flex flex-col gap-12 max-w-2xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-3xl mb-2 text-admin-ink">Settings</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-admin-ink2">Manage your account and integrations</p>
        </div>
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </AdminButton>
      </div>

      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4 border border-border p-6 bg-paper">
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

        <section className="flex flex-col gap-4 border border-border p-6 bg-paper">
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
