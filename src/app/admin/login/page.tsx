'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminButton } from '@/components/admin/AdminButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] animate-fi">
      <div className="text-center mb-10">
        <h1 className="font-playfair text-[13px] font-black tracking-wide text-ink-public">
          Danadirsha <span className="font-normal italic text-ink2-public">· Admin</span>
        </h1>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <AdminInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <AdminInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {error && <p className="font-mono text-[10px] text-accent mt-[-16px]">{error}</p>}

        <label className="flex items-center gap-2 cursor-pointer mt-[-8px]">
          <input type="checkbox" className="accent-accent" />
          <span className="font-mono text-[10px] text-ink2-public">Remember me</span>
        </label>

        <AdminButton type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'SIGNING IN...' : 'SIGN IN →'}
        </AdminButton>
      </form>
    </div>
  );
}
