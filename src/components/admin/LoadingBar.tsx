'use client';
import { useState, useEffect } from 'react';

export function LoadingBar() {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      setActiveRequests((prev) => prev + 1);
      try {
        const response = await originalFetch.apply(this, args);
        return response;
      } finally {
        setActiveRequests((prev) => Math.max(0, prev - 1));
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (activeRequests === 0) return null;

  return (
    <>
      <div className="absolute top-14 left-0 w-full h-[2px] bg-[rgba(200,68,26,0.2)] z-50 overflow-hidden">
        <div className="h-full bg-accent admin-loading-bar" />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-loading {
          0% { transform: translateX(-100%); width: 50%; }
          100% { transform: translateX(200%); width: 50%; }
        }
        .admin-loading-bar {
          animation: admin-loading 1.2s infinite ease-in-out;
        }
      `}} />
    </>
  );
}
