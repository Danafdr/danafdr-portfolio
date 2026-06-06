'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/api';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUser()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  if (loading) {
    // Show blank dark screen (no flash)
    return <div className="min-h-screen bg-bg"></div>;
  }

  return <>{children}</>;
}
