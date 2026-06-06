'use client';

import { useState } from 'react';
import { AdminInput } from './AdminInput';
import { AdminButton } from './AdminButton';
import { toast } from './Toast';
import { uploadVideo, deleteVideo, updateProject } from '@/lib/api';

export function StepMediaMotion({ projectId, initialData, onComplete }: { projectId: number, initialData?: any, onComplete: () => void }) {
  const [mode, setMode] = useState<'upload' | 'link'>(initialData?.video_url ? 'link' : 'upload');
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [videoPath, setVideoPath] = useState(initialData?.video_path || '');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!videoFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      const res = await uploadVideo(projectId, formData);
      setVideoPath(res.path);
      toast('Video uploaded successfully', 'success');
      onComplete();
    } catch (e: any) {
      toast(e.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLink = async () => {
    if (!videoUrl) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('video_url', videoUrl);
      
      // Determine platform
      let platform = 'other';
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) platform = 'youtube';
      else if (videoUrl.includes('instagram.com')) platform = 'instagram';
      else if (videoUrl.includes('tiktok.com')) platform = 'tiktok';
      else if (videoUrl.includes('vimeo.com')) platform = 'vimeo';
      
      formData.append('video_platform', platform);
      
      await updateProject(projectId, formData);
      toast('Video link saved', 'success');
      onComplete();
    } catch (e: any) {
      toast(e.message || 'Save failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 p-1 bg-bg border border-border w-fit">
        <button 
          onClick={() => setMode('upload')}
          className={`px-4 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${mode === 'upload' ? 'bg-admin-ink text-bg' : 'text-admin-ink2 hover:text-admin-ink'}`}
        >
          Upload file
        </button>
        <button 
          onClick={() => setMode('link')}
          className={`px-4 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${mode === 'link' ? 'bg-admin-ink text-bg' : 'text-admin-ink2 hover:text-admin-ink'}`}
        >
          Paste link
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="flex flex-col gap-4">
          <label className="cursor-pointer border border-dashed border-border px-4 py-12 text-center hover:border-accent transition-colors">
            <span className="font-mono text-[10px] text-admin-ink3 uppercase block mb-2">Select video file (mp4, mov, webm max 100MB)</span>
            {videoFile && <span className="font-mono text-[12px] text-admin-ink block">{videoFile.name}</span>}
            <input type="file" className="hidden" accept="video/mp4,video/quicktime,video/webm" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
          </label>
          <AdminButton onClick={handleUpload} disabled={!videoFile || loading}>
            {loading ? 'Uploading...' : 'Upload & Finish'}
          </AdminButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AdminInput 
            label="Video URL" 
            value={videoUrl} 
            onChange={e => setVideoUrl(e.target.value)} 
            placeholder="https://youtube.com/..." 
          />
          <AdminButton onClick={handleSaveLink} disabled={!videoUrl || loading}>
            {loading ? 'Saving...' : 'Save Link & Finish'}
          </AdminButton>
        </div>
      )}
    </div>
  );
}
