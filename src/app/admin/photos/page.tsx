'use client';

import { useEffect, useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAdminGalleryPhotos, uploadGalleryPhoto, analyzeGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, toggleGalleryFeatured, reorderGalleryPhotos } from '@/lib/api';
import { toast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface PhotoItem {
  id: number;
  url: string;
  source: string;
  tags: string[];
  ai_tags: string[];
  caption: string | null;
  featured: boolean;
  order: number;
}

// -----------------------------------------------------------------------------
// Sortable Photo Item Component
// -----------------------------------------------------------------------------
function SortablePhoto({
  photo,
  onToggleFeatured,
  onDelete,
  onEditTags,
}: {
  photo: PhotoItem;
  onToggleFeatured: (id: number) => void;
  onDelete: (id: number) => void;
  onEditTags: (photo: PhotoItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full aspect-[3/2] bg-bg2 border ${isDragging ? 'border-accent shadow-2xl scale-105' : 'border-border'} group overflow-hidden`}
    >
      <img src={photo.url} alt="" className="w-full h-full object-cover" />
      
      {/* Source Badge */}
      <div className="absolute top-2 left-2 bg-bg/80 backdrop-blur-sm px-2 py-[2px] border border-border">
        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-admin-ink2">{photo.source}</span>
      </div>

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-2">
        {/* Top actions */}
        <div className="flex justify-between items-start">
          <button 
            onClick={() => onToggleFeatured(photo.id)}
            className={`p-1 ${photo.featured ? 'text-accent' : 'text-admin-ink3 hover:text-admin-ink'} transition-colors`}
            title="Toggle Featured"
          >
            {photo.featured ? '★' : '☆'}
          </button>
          
          <button 
            onClick={() => onDelete(photo.id)}
            className="p-1 text-admin-ink3 hover:text-accent transition-colors"
            title="Delete Photo"
          >
            ×
          </button>
        </div>

        {/* Center Drag Handle */}
        <div 
          className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-admin-ink2 hover:text-admin-ink"
          {...attributes} {...listeners}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="16" r="1.5" />
            <circle cx="16" cy="8" r="1.5" />
            <circle cx="16" cy="16" r="1.5" />
          </svg>
        </div>

        {/* Bottom actions */}
        <div className="flex justify-between items-center mt-auto">
          <span className="font-mono text-[8px] text-admin-ink3">
            {photo.tags?.length || 0} tags
          </span>
          <button 
            onClick={() => onEditTags(photo)}
            className="font-mono text-[9px] uppercase tracking-[0.1em] text-admin-ink2 hover:text-admin-ink"
          >
            ✎ Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Page Component
// -----------------------------------------------------------------------------
export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sourceTab, setSourceTab] = useState<'all' | 'sim' | 'real'>('all');
  
  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchPhotos = () => {
    setLoading(true);
    getAdminGalleryPhotos()
      .then(setPhotos)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => String(p.id) === String(active.id));
      const newIndex = photos.findIndex((p) => String(p.id) === String(over.id));
      
      const newPhotos = arrayMove(photos, oldIndex, newIndex);
      setPhotos(newPhotos);

      const orderPayload = newPhotos.map((p, i) => ({ id: p.id, order: i }));
      try {
        await reorderGalleryPhotos(orderPayload);
        toast('Order saved', 'success');
      } catch {
        toast('Failed to save order', 'error');
        fetchPhotos();
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGalleryPhoto(deleteId);
      toast('Photo deleted', 'success');
      setPhotos(photos.filter((p) => p.id !== deleteId));
    } catch {
      toast('Failed to delete', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const p = photos.find(x => String(x.id) === String(id));
    if (!p) return;
    
    // Check if adding 5th
    if (!p.featured) {
      const featuredCount = photos.filter(x => x.featured).length;
      if (featuredCount >= 4) {
        toast('Only 4 photos can be featured.', 'error');
        return;
      }
    }

    setPhotos(photos.map(x => String(x.id) === String(id) ? { ...x, featured: !x.featured } : x));
    try {
      await toggleGalleryFeatured(id);
      toast('Featured status updated', 'success');
    } catch {
      toast('Failed to update', 'error');
      fetchPhotos();
    }
  };

  const handleSaveTags = async (id: number, tags: string[], source: string) => {
    try {
      await updateGalleryPhoto(id, { tags, source });
      setPhotos(photos.map(p => String(p.id) === String(id) ? { ...p, tags, source } : p));
      toast('Photo updated', 'success');
      setEditingPhoto(null);
    } catch {
      toast('Failed to update photo', 'error');
    }
  };

  const filteredPhotos = photos.filter(p => sourceTab === 'all' || p.source === sourceTab);

  if (loading) return null;

  return (
    <div className="animate-fi">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-[28px] text-admin-ink italic mb-2">Photos</h1>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-accent text-bg font-mono text-[11px] uppercase tracking-[0.1em] px-6 py-3 hover:opacity-85 transition-opacity"
        >
          + Upload photos
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8">
        {['all', 'sim', 'real'].map(s => (
          <button
            key={s}
            onClick={() => setSourceTab(s as any)}
            className={`font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2 border transition-colors ${
              sourceTab === s ? 'border-accent text-admin-ink bg-bg2' : 'border-border text-admin-ink3 hover:text-admin-ink2'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredPhotos.map((p) => p.id)} strategy={rectSortingStrategy}>
            {filteredPhotos.map((photo) => (
              <SortablePhoto
                key={photo.id}
                photo={photo}
                onToggleFeatured={handleToggleFeatured}
                onDelete={setDeleteId}
                onEditTags={setEditingPhoto}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onUploadComplete={fetchPhotos} 
        />
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <EditPhotoModal 
          photo={editingPhoto} 
          onClose={() => setEditingPhoto(null)} 
          onSave={handleSaveTags} 
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Photo?"
        message="This action cannot be undone. The image file will be permanently removed."
        confirmText="DELETE"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Edit Photo Modal Component
// -----------------------------------------------------------------------------
function EditPhotoModal({ photo, onClose, onSave }: { photo: PhotoItem; onClose: () => void; onSave: (id: number, tags: string[], source: string) => void }) {
  const [tags, setTags] = useState<string[]>(photo.tags || []);
  const [newTag, setNewTag] = useState('');
  const [source, setSource] = useState(photo.source);

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg/95 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-fi">
      <div className="bg-bg2 border border-border w-full max-w-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-admin-ink3 hover:text-admin-ink font-mono text-xl">×</button>
        
        <div className="flex gap-8">
          {/* Left: preview */}
          <div className="w-1/2">
            <img src={photo.url} alt="" className="w-full h-auto border border-border" />
          </div>
          
          {/* Right: form */}
          <div className="w-1/2 flex flex-col">
            <h3 className="font-playfair text-[20px] text-admin-ink italic mb-6">Edit Photo Details</h3>
            
            <div className="mb-6">
              <span className="block font-mono text-[9px] uppercase text-admin-ink3 tracking-[0.1em] mb-2">Source</span>
              <div className="flex gap-2">
                <button onClick={() => setSource('sim')} className={`filter-pill font-mono text-[10px] uppercase px-4 py-2 ${source === 'sim' ? 'active' : ''}`}>SIM</button>
                <button onClick={() => setSource('real')} className={`filter-pill font-mono text-[10px] uppercase px-4 py-2 ${source === 'real' ? 'active' : ''}`}>REAL</button>
              </div>
            </div>

            <div className="mb-6">
              <span className="block font-mono text-[9px] uppercase text-admin-ink3 tracking-[0.1em] mb-2">Tags</span>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(t => (
                  <span key={t} className="font-mono text-[10px] px-2 py-1 bg-black/20 border border-border flex items-center gap-2">
                    {t} <button onClick={() => setTags(tags.filter(x => x !== t))} className="text-accent hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <form onSubmit={addTag} className="flex gap-2">
                <input 
                  type="text" 
                  value={newTag} 
                  onChange={e => setNewTag(e.target.value)} 
                  placeholder="add tag..." 
                  className="flex-1 bg-bg border border-border px-3 py-2 font-mono text-[11px] text-admin-ink focus:outline-none focus:border-admin-ink"
                />
                <button type="submit" className="px-3 bg-bg border border-border font-mono text-[10px] uppercase hover:bg-black/20">+</button>
              </form>
            </div>

            <button onClick={() => onSave(photo.id, tags, source)} className="mt-auto bg-accent text-bg px-6 py-3 font-mono text-[11px] uppercase tracking-[0.1em] hover:opacity-90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Upload Modal Component
// -----------------------------------------------------------------------------
interface UploadingFile {
  file: File;
  id?: number;
  preview: string;
  status: 'uploading' | 'analyzing' | 'done' | 'error';
  tags: string[];
  ai_tags: string[];
  source: string;
}

function UploadModal({ onClose, onUploadComplete }: { onClose: () => void; onUploadComplete: () => void }) {
  const [uploads, setUploads] = useState<UploadingFile[]>([]);
  const [globalSource, setGlobalSource] = useState<'sim' | 'real'>('sim');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const newUploads = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading' as const,
      tags: [],
      ai_tags: [],
      source: globalSource
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Process each upload sequentially or in parallel
    for (let i = 0; i < newUploads.length; i++) {
      const uf = newUploads[i];
      try {
        // Upload
        const uploadRes = await uploadGalleryPhoto(uf.file, uf.source);
        const dbId = uploadRes.id;
        
        setUploads(current => current.map(u => u.file.name === uf.file.name ? { ...u, id: dbId, status: 'analyzing' } : u));
        
        // Analyze
        const analysisRes = await analyzeGalleryPhoto(uploadRes.path);
        const aiTags = analysisRes.tags || [];

        // Auto-approve all tags by default as requested
        await updateGalleryPhoto(dbId, { tags: aiTags, ai_tags: aiTags });

        setUploads(current => current.map(u => u.file.name === uf.file.name ? { ...u, status: 'done', tags: aiTags, ai_tags: aiTags } : u));
      } catch (err) {
        console.error(err);
        setUploads(current => current.map(u => u.file.name === uf.file.name ? { ...u, status: 'error' } : u));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-sm overflow-y-auto p-10 animate-fi">
      <div className="max-w-4xl mx-auto flex flex-col min-h-full">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-playfair text-[32px] text-admin-ink italic">Upload Photos</h2>
          <button onClick={() => { onUploadComplete(); onClose(); }} className="text-admin-ink3 hover:text-admin-ink font-mono text-2xl">×</button>
        </div>

        {/* Global Source Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] text-admin-ink3 uppercase tracking-[0.1em]">Batch Source:</span>
          <div className="flex gap-2">
            <button onClick={() => setGlobalSource('sim')} className={`filter-pill font-mono text-[10px] uppercase px-4 py-2 ${globalSource === 'sim' ? 'active' : ''}`}>SIM</button>
            <button onClick={() => setGlobalSource('real')} className={`filter-pill font-mono text-[10px] uppercase px-4 py-2 ${globalSource === 'real' ? 'active' : ''}`}>REAL</button>
          </div>
        </div>

        {/* Dropzone */}
        <div 
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="hoverable border-2 border-dashed border-border p-16 flex flex-col items-center justify-center cursor-pointer mb-10 bg-bg2/50"
        >
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" ref={fileInputRef} onChange={e => { if (e.target.files) handleFiles(e.target.files); }} />
          <p className="font-playfair italic text-[22px] text-admin-ink2 mb-3">Drop photos here</p>
          <p className="font-mono text-[10px] text-admin-ink3 uppercase tracking-[0.1em]">or click to browse · jpg, png, webp · max 5MB each</p>
        </div>

        {/* Upload List */}
        <div className="flex flex-col gap-4 flex-1">
          {uploads.map((u, i) => (
            <div key={i} className="flex gap-4 p-4 border border-border bg-bg2 items-center">
              <img src={u.preview} alt="" className="w-16 h-12 object-cover border border-border" />
              
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] text-admin-ink truncate mb-1">{u.file.name}</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase text-admin-ink3">
                    {u.status === 'uploading' && 'Uploading...'}
                    {u.status === 'analyzing' && 'Analyzing AI Tags...'}
                    {u.status === 'done' && <span className="text-green-500">{u.tags.length} tags ✓</span>}
                    {u.status === 'error' && <span className="text-red-500">Error</span>}
                  </span>
                  {u.status === 'uploading' && <div className="flex-1 h-[2px] bg-border overflow-hidden"><div className="h-full bg-accent animate-pulse" style={{width: '50%'}}></div></div>}
                </div>
              </div>

              {/* Badges/Tags shown when done */}
              {u.status === 'done' && (
                <div className="flex items-center gap-2 max-w-[50%] overflow-hidden">
                  <span className="font-mono text-[8px] uppercase border border-border px-2 py-1 shrink-0">{u.source}</span>
                  <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                    {u.tags.map(t => (
                      <span key={t} className="font-mono text-[8px] border border-border px-2 py-1 shrink-0 bg-black/20 text-admin-ink2 whitespace-nowrap">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {uploads.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={() => { onUploadComplete(); onClose(); }}
              disabled={uploads.some(u => u.status !== 'done' && u.status !== 'error')}
              className="bg-accent text-bg px-8 py-4 font-mono text-[11px] uppercase tracking-[0.1em] hover:opacity-90 disabled:opacity-50"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
