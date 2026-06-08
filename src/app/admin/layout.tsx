'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminGuard } from './AdminGuard';
import { ToastProvider } from '@/components/admin/Toast';
import { LoadingBar } from '@/components/admin/LoadingBar';
import { logout } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-paper flex items-center justify-center">{children}</div>;
  }

  return (
    <AdminGuard>
      <div className="admin-page min-h-screen bg-bg text-admin-ink font-mono select-none">
        <ToastProvider />
        {/* Sticky top nav */}
        <header className="sticky top-0 z-50 border-b border-border bg-[rgba(15,14,11,0.97)] backdrop-blur-md">
          <LoadingBar />
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            
            {/* Left */}
            <div className="flex items-center">
              <Link href="/admin" className="font-playfair text-[13px] font-black tracking-wide text-admin-ink">
                Danadirsha <span className="font-normal italic text-admin-ink2">· Admin</span>
              </Link>
            </div>

            {/* Center */}
            <nav className="flex items-center gap-6 text-[9px] uppercase tracking-[0.18em]">
              <Link href="/admin" className={pathname === '/admin' ? 'text-admin-ink' : 'text-admin-ink3'}>
                Dashboard
              </Link>
              <Link href="/admin/hero" className={pathname.startsWith('/admin/hero') ? 'text-admin-ink' : 'text-admin-ink3'}>
                Hero
              </Link>
              <Link href="/admin/projects" className={pathname.startsWith('/admin/projects') ? 'text-admin-ink' : 'text-admin-ink3'}>
                Projects
              </Link>
              <Link href="/admin/photos" className={pathname.startsWith('/admin/photos') ? 'text-admin-ink' : 'text-admin-ink3'}>
                Photos
              </Link>
              <Link href="/admin/messages" className={pathname.startsWith('/admin/messages') ? 'text-admin-ink' : 'text-admin-ink3'}>
                Messages
              </Link>
              <Link href="/admin/settings" className={pathname.startsWith('/admin/settings') ? 'text-admin-ink' : 'text-admin-ink3'}>
                Settings
              </Link>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-6">
              <a href="/" target="_blank" rel="noopener noreferrer" className="nav-link text-[10px] text-admin-ink2">
                View site ↗
              </a>
              <button 
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }} 
                className="btn-ghost px-3 py-1 text-[9px] uppercase tracking-[0.1em] border border-border text-admin-ink3 hover:text-admin-ink hover:border-admin-ink transition-colors"
              >
                Logout
              </button>
            </div>

          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
