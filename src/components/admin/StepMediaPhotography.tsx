'use client';

import { useState, useEffect } from 'react';
import { getAdminProjectPhotos, uploadPhoto, updatePhotoData, deletePhoto, reorderPhotos, analyzePhoto } from '@/lib/api';
import { toast } from './Toast';

export function StepMediaPhotography({ projectId }: { projectId: number }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, [projectId]);

  const loadPhotos = async () => {
    try {
      const data = await getAdminProjectPhotos(projectId);
      setPhotos(data);
    } catch (e: any) {
      toast('Failed to load photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        const photo = await uploadPhoto(projectId, formData);
        setPhotos(prev => [...prev, photo]);
        
        // Trigger AI Tagging automatically
        toast(`Analyzing photo...`, 'success');
        try {
          const aiRes = await analyzePhoto(projectId, photo.id);
          if (aiRes.tags) {
            await updatePhotoData(projectId, photo.id, { ai_tags: aiRes.tags });
            setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, ai_tags: aiRes.tags } : p));
          }
        } catch (err) {
          console.error("AI tagging failed", err);
        }
      } catch (err) {
        toast(`Failed to upload ${file.name}`, 'error');
      }
    }
    // Refresh to ensure order is correct
    loadPhotos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete photo?')) return;
    try {
      await deletePhoto(projectId, id);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (e) {
      toast('Failed to delete', 'error');
    }
  };

  const acceptAiTag = async (photoId: number, tag: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    const newTags = [...(photo.tags || []), tag];
    try {
      await updatePhotoData(projectId, photoId, { tags: newTags });
      setPhotos(photos.map(p => p.id === photoId ? { ...p, tags: newTags } : p));
    } catch (e) {}
  };

  const removeTag = async (photoId: number, tag: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    const newTags = (photo.tags || []).filter((t: string) => t !== tag);
    try {
      await updatePhotoData(projectId, photoId, { tags: newTags });
      setPhotos(photos.map(p => p.id === photoId ? { ...p, tags: newTags } : p));
    } catch (e) {}
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Zone */}
      <label className="cursor-pointer border border-dashed border-border px-4 py-12 text-center hover:border-accent transition-colors block">
        <span className="font-mono text-[10px] text-admin-ink3 uppercase block mb-2">Upload Photos (Multi-select)</span>
        <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} />
      </label>

      {loading ? (
        <div className="font-mono text-[10px] text-admin-ink3 uppercase">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="border border-border p-2 flex flex-col gap-3">
              <div className="relative group">
                <img src={photo.url} alt="" className="w-full h-32 object-cover" />
                <button 
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 bg-bg text-admin-ink w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>

              {/* Tags Section */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] uppercase text-admin-ink2 border-b border-border pb-1">Approved Tags</span>
                <div className="flex flex-wrap gap-1">
                  {(photo.tags || []).map((t: string) => (
                    <span key={`t-${t}`} className="bg-admin-ink text-bg px-2 py-0.5 text-[9px] font-mono flex items-center gap-1">
                      {t} <button onClick={() => removeTag(photo.id, t)}>×</button>
                    </span>
                  ))}
                  {!(photo.tags?.length) && <span className="text-[9px] text-admin-ink3 italic">None</span>}
                </div>

                {photo.ai_tags?.length > 0 && (
                  <>
                    <span className="font-mono text-[9px] uppercase text-admin-ink2 border-b border-border pb-1 mt-2">AI Suggested</span>
                    <div className="flex flex-wrap gap-1">
                      {photo.ai_tags.map((at: string) => {
                        const isApproved = (photo.tags || []).includes(at);
                        if (isApproved) return null;
                        return (
                          <button key={`at-${at}`} onClick={() => acceptAiTag(photo.id, at)} className="border border-dashed border-border text-admin-ink px-2 py-0.5 text-[9px] font-mono hover:border-accent hover:text-accent">
                            + {at}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
