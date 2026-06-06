'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getPhotos } from '@/lib/api';
import dynamic from 'next/dynamic';

const Lightbox = dynamic(() => import('@/components/Lightbox'), { ssr: false });

interface Photo {
  id: number;
  url: string;
  source: string;
  tags: string[];
  width: number;
  height: number;
}

interface Counts {
  all: number;
  sim: number;
  real: number;
}

function useInfinitePhotos(source: 'all' | 'sim' | 'real') {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchBatch = async (currentPage: number, currentSource: string) => {
    setLoading(true);
    try {
      const sourceParam = currentSource === 'all' ? null : currentSource;
      const res = await getPhotos({ page: currentPage, per_page: 12, ...(sourceParam ? { source: sourceParam } : {}) });
      
      if (res && res.photos) {
        setPhotos(prev => {
          // avoid duplicates (strict mode mounts twice)
          const newPhotos = res.photos.filter((p: Photo) => !prev.some(existing => existing.id === p.id));
          return [...prev, ...newPhotos];
        });
        setHasMore(res.has_more);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Reset on source change
  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    fetchBatch(1, source);
  }, [source]);

  const sentinelRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBatch(nextPage, source);
      }
    }, { rootMargin: '400px' }); // Trigger a bit earlier before bottom

    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, source]);

  return { photos, loading, hasMore, sentinelRef };
}

export default function PhotographyPage() {
  const [counts, setCounts] = useState<Counts>({ all: 0, sim: 0, real: 0 });
  const [source, setSource] = useState<'all' | 'sim' | 'real'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { photos, loading, hasMore, sentinelRef } = useInfinitePhotos(source);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/photos/counts`, { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => setCounts(data))
      .catch(console.error);
  }, []);

  const displayCount = source === 'all' ? counts.all : (source === 'sim' ? counts.sim : counts.real);
  const showRealToggle = counts.real >= 4;

  return (
    <div className="min-h-screen bg-paper flex flex-col font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f0ebe2]/96 backdrop-blur-[10px] border-b border-border h-[52px] px-4 md:px-10 flex justify-between items-center text-ink shrink-0">
        <Link href="/work" className="font-mono text-[9px] text-ink2 uppercase tracking-[0.18em] hover:text-ink transition-colors">
          ← Work
        </Link>
        <h1 className="font-playfair text-[13px] font-black tracking-[0.08em] ml-4">Photography</h1>
        <div className="font-mono text-[9px] text-ink3 text-right">
          {displayCount > 0 ? `${displayCount} ${displayCount === 1 ? 'photograph' : 'photographs'}` : '...'}
        </div>
      </header>

      {/* Source Bar */}
      <div className="border-b border-border px-4 md:px-10 py-3 bg-paper flex justify-between items-center shrink-0">
        <div className="flex gap-6">
          <button
            onClick={() => setSource('all')}
            className={`font-mono text-[8px] md:text-[9px] uppercase tracking-[0.22em] transition-colors duration-150 ${source === 'all' ? 'text-ink font-medium' : 'text-ink3 font-light hover:text-ink2'}`}
          >
            ALL
          </button>
          <button
            onClick={() => setSource('sim')}
            className={`font-mono text-[8px] md:text-[9px] uppercase tracking-[0.22em] transition-colors duration-150 ${source === 'sim' ? 'text-ink font-medium' : 'text-ink3 font-light hover:text-ink2'}`}
          >
            SIM
          </button>
          {showRealToggle && (
            <button
              onClick={() => setSource('real')}
              className={`font-mono text-[8px] md:text-[9px] uppercase tracking-[0.22em] transition-colors duration-150 ${source === 'real' ? 'text-ink font-medium' : 'text-ink3 font-light hover:text-ink2'}`}
            >
              REAL
            </button>
          )}
        </div>
      </div>

      {/* Masonry Grid */}
      <main className="flex-1 px-4 md:px-10 pb-[60px] md:pb-20 pt-1.5">
        <div className="columns-2 sm:columns-3 xl:columns-4 gap-1.5">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="break-inside-avoid mb-1.5 animate-fi"
              style={{ animationDelay: `${(index % 12) * 30}ms` }}
            >
              <img
                src={photo.url}
                alt=""
                loading={index < 4 ? "eager" : "lazy"}
                onClick={() => setLightboxIndex(index)}
                className="w-full h-auto block cursor-pointer"
                style={{ 
                  aspectRatio: photo.width && photo.height ? `${photo.width}/${photo.height}` : 'auto' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Sentinel & Loading Indicator */}
        <div ref={sentinelRef} className="h-20 w-full flex items-center justify-center mt-10">
          {loading && (
            <div className="w-10 h-[1px] bg-accent origin-left animate-sweep"></div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && photos.length > 0 && (
        <Lightbox
          photos={photos}
          lightboxIndex={lightboxIndex}
          setLightboxIndex={setLightboxIndex}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sweep { 
          from { transform: scaleX(0); } 
          to { transform: scaleX(1); } 
        }
        .animate-sweep {
          animation: sweep 1s ease-in-out infinite alternate;
        }
        .animate-fi {
          animation: fi 0.3s ease forwards;
          opacity: 0;
        }
        @keyframes fi {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}
