'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFeaturedPhotos } from '@/lib/api';

interface Photo {
  id: number;
  url: string;
  width: number;
  height: number;
  caption?: string;
}

export function PhotographyTease() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedPhotos()
      .then(setPhotos)
      .finally(() => setLoading(false));
  }, []);

  if (loading || photos.length === 0) return null;

  return (
    <section className="px-5 md:px-10 border-b border-border">
      <div className="font-mono text-[9px] text-ink3 uppercase tracking-[0.28em] pt-7 pb-4">
        Photography
      </div>
      <div
        onClick={() => router.push('/photography')}
        className="photo-tease-strip flex gap-[3px] cursor-pointer h-[200px] overflow-hidden pb-10"
      >
        {photos.map((photo, i) => (
          <div key={photo.id} style={{
            position: 'relative', flexShrink: 0,
            width: photo.width && photo.height ? `${(photo.width / photo.height) * 200}px` : 'auto',
            height: '200px',
          }} className="photo-tease-item">
            <img src={photo.url} loading="lazy" alt={photo.caption || ''}
              className="w-full h-full object-cover block" />
            {i === photos.length - 1 && (
              <div 
                className="photo-tease-overlay absolute inset-0 flex items-center justify-center"
              >
                <span className="font-mono text-[10px] text-paper uppercase tracking-[0.18em]">
                  View all →
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
