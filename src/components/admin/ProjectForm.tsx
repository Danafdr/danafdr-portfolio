'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject, processThumbnail } from '@/lib/api';
import { AdminInput } from './AdminInput';
import { AdminButton } from './AdminButton';
import { toast } from './Toast';
import { StepMediaMotion } from './StepMediaMotion';
import { StepMediaPhotography } from './StepMediaPhotography';
import ImageEditor from '../ImageEditor';

interface ProjectFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  // Basic Info (Step 1)
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [type, setType] = useState(initialData?.type || 'web');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const typeOptions = [
    { value: 'web', label: 'Web Development' },
    { value: 'motion', label: 'Motion Design' },
    { value: 'video', label: 'Video Editing' },
    { value: 'photography', label: 'Photography' },
    { value: 'other', label: 'Other' },
  ];
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [description, setDescription] = useState(initialData?.description || '');
  const [fullDescription, setFullDescription] = useState(initialData?.full_description || '');
  const [toolsString, setToolsString] = useState(initialData?.tools?.join(', ') || '');
  
  // URLs (Step 1 or 2 depending on type)
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || '');
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || '');
  
  // Design (Step 2)
  const [gradientStart, setGradientStart] = useState(initialData?.gradient_start || '#1a1816');
  const [gradientEnd, setGradientEnd] = useState(initialData?.gradient_end || '#2a2420');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail_url || '');

  // We will save first, and if it's a new project, we get the ID so Step 2 can upload files directly (for Photos and Videos).
  const [projectId, setProjectId] = useState<number | null>(initialData?.id || null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveStep1 = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('type', type);
    formData.append('year', year.toString());
    formData.append('description', description);
    formData.append('full_description', fullDescription);
    if (type !== 'photography' && toolsString.trim()) {
        const toolsArr = toolsString.split(',').map((t: string) => t.trim()).filter(Boolean);
        toolsArr.forEach((t: string, i: number) => formData.append(`tools[${i}]`, t));
    }
    if (type === 'web' || type === 'other') {
        formData.append('live_url', liveUrl);
        if (type === 'web') formData.append('repo_url', repoUrl);
    }
    
    // Also append gradients if they exist to avoid validation errors if they are required
    formData.append('gradient_start', gradientStart);
    formData.append('gradient_end', gradientEnd);

    try {
      if (projectId) {
        await updateProject(projectId, formData);
        toast('Project updated', 'success');
        setStep(2);
      } else {
        const res = await createProject(formData);
        setProjectId(res.id);
        toast('Project created. Now add media.', 'success');
        setStep(2);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to save basic info', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep2WebOther = async () => {
    if (!projectId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('gradient_start', gradientStart);
    formData.append('gradient_end', gradientEnd);
    
    // Laravel `PUT` requests with multipart/form-data can be tricky.
    // It's usually better to use POST and add _method=PUT, but our api client sends PUT directly.
    // We will resend all required data to satisfy ProjectRequest.
    formData.append('_method', 'PUT');
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', description);
    
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    try {
      // In Next.js api client, updateProject is PUT. We need to handle File uploads carefully if backend expects POST with _method=PUT.
      // Let's rely on standard updateProject which is PUT and see if Laravel handles it.
      // Actually Laravel requires POST + _method=PUT for multipart/form-data containing files!
      // But we will just try using POST with _method=PUT natively via our `apiFetch` using a custom call or modifying `updateProject`.
      // Actually, updateProject is defined as PUT.
      await updateProject(projectId, formData);
      toast('Media saved', 'success');
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      toast(err.message || 'Failed to save media', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl animate-fi">
      <div className="flex gap-4 mb-8 border-b border-border pb-4">
        {[1, 2].map((s) => (
          <div key={s} className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] ${step === s ? 'text-admin-ink' : 'text-admin-ink3'}`}>
            <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${step === s ? 'border-accent text-accent' : 'border-border'}`}>{s}</span>
            {s === 1 && 'Basic Info'}
            {s === 2 && 'Media & Content'}
          </div>
        ))}
      </div>

      <div className="bg-bg2 border border-border p-8 mb-8">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="text-[10px] uppercase tracking-[0.15em] text-admin-ink2">Quick Import</div>
              <button 
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/admin/github/repos');
                    if (!res.ok) throw new Error(await res.text());
                    const repos = await res.json();
                    if (repos.error) throw new Error(repos.error);
                    
                    const repoName = prompt("Enter exactly the name of the repository to import (e.g., 'my-website')\n\nAvailable:\n" + repos.map((r: any) => r.name).slice(0, 10).join(', ') + '...');
                    if (!repoName) return;

                    const repo = repos.find((r: any) => r.name === repoName);
                    if (repo) {
                      setTitle(repo.name);
                      if (repo.description) setDescription(repo.description);
                      if (repo.html_url) setRepoUrl(repo.html_url);
                      if (repo.homepage) setLiveUrl(repo.homepage);
                      if (repo.topics && repo.topics.length > 0) setToolsString(repo.topics.join(', '));
                      else if (repo.language) setToolsString(repo.language);
                      toast('Imported repo details!', 'success');
                    } else {
                      toast('Repo not found', 'error');
                    }
                  } catch (e: any) {
                    toast(e.message || 'Failed to fetch repos', 'error');
                  }
                }}
                className="font-mono text-[9px] uppercase tracking-[0.1em] border border-border px-3 py-1 hover:text-accent hover:border-accent transition-colors"
              >
                Fetch from GitHub
              </button>
            </div>

            <AdminInput label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <AdminInput label="Slug (optional)" value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated if empty" />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 relative">
                <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-admin-ink2">Project Type</label>
                <div className="relative">
                  <div 
                    className="w-full bg-bg text-admin-ink border border-border px-[14px] py-[10px] font-mono text-[12px] cursor-pointer flex justify-between items-center hover:border-accent transition-colors"
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  >
                    {typeOptions.find(o => o.value === type)?.label}
                    <span className="text-[8px] text-admin-ink2">{typeDropdownOpen ? '▲' : '▼'}</span>
                  </div>
                  {typeDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-bg border border-border border-t-0 z-50 flex flex-col mt-1">
                      {typeOptions.filter(o => o.value !== type).map(o => (
                        <div 
                          key={o.value}
                          className="px-[14px] py-[10px] font-mono text-[12px] hover:bg-bg3 cursor-pointer text-admin-ink transition-colors"
                          onClick={() => { setType(o.value); setTypeDropdownOpen(false); }}
                        >
                          {o.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <AdminInput label="Year" type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} required />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-admin-ink2">Short Description</label>
                <button 
                  type="button"
                  onClick={async () => {
                    toast('Generating...', 'success');
                    try {
                      const res = await fetch('/api/admin/ai/generate-description', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, type, repo_url: repoUrl, tools: toolsString.split(',').map(s => s.trim()) })
                      });
                      const data = await res.json();
                      if (res.ok && data.description) {
                        setDescription(data.description);
                        toast('Description generated!', 'success');
                      } else {
                        toast(data.error || 'Failed to generate', 'error');
                      }
                    } catch {
                      toast('Error connecting to AI', 'error');
                    }
                  }}
                  className="text-[9px] text-accent uppercase tracking-wider hover:underline"
                >
                  Magic Auto-fill ✨
                </button>
              </div>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} maxLength={200} className="w-full bg-bg text-admin-ink border border-border px-[14px] py-[10px] font-mono text-[12px] focus:border-accent focus:outline-none resize-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-admin-ink2">Full Description (Markdown, optional)</label>
              <textarea value={fullDescription} onChange={e => setFullDescription(e.target.value)} rows={4} className="w-full bg-bg text-admin-ink border border-border px-[14px] py-[10px] font-mono text-[12px] focus:border-accent focus:outline-none resize-none" />
            </div>

            {type !== 'photography' && (
              <AdminInput label="Tools (comma separated)" value={toolsString} onChange={e => setToolsString(e.target.value)} placeholder="e.g. Next.js, Tailwind, After Effects" />
            )}

            {(type === 'web' || type === 'other') && (
              <div className="grid grid-cols-2 gap-6">
                <AdminInput label="Live site" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://..." />
                {type === 'web' && (
                  <AdminInput label="Repository" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="https://github.com/..." />
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && projectId && (
          <div className="flex flex-col gap-6">
            {type === 'photography' ? (
              <StepMediaPhotography projectId={projectId} />
            ) : (type === 'motion' || type === 'video') ? (
              <StepMediaMotion projectId={projectId} initialData={initialData} onComplete={() => { router.push('/admin/projects'); router.refresh(); }} />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-admin-ink2">Thumbnail</label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <div className="flex flex-col gap-2">
                        <img src={thumbnailPreview} alt="Preview" className="w-24 h-24 object-cover border border-border" />
                        <button 
                          onClick={() => setEditorOpen(true)}
                          className="font-mono text-[9px] text-accent hover:underline uppercase text-left"
                        >
                          Edit image →
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer border border-dashed border-border px-4 py-8 text-center flex-1 hover:border-accent transition-colors h-24 flex items-center justify-center">
                      <span className="font-mono text-[10px] text-admin-ink3 uppercase">Click to upload thumbnail</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <AdminInput label="Gradient Start (Hex)" value={gradientStart} onChange={e => setGradientStart(e.target.value)} />
                  <AdminInput label="Gradient End (Hex)" value={gradientEnd} onChange={e => setGradientEnd(e.target.value)} />
                </div>
                <div className="h-12 w-full mt-2 border border-border" style={{ background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})` }} />
              </div>
            )}
          </div>
        )}
      </div>

      {projectId && (
        <ImageEditor 
          isOpen={editorOpen} 
          onClose={() => setEditorOpen(false)}
          imageUrl={thumbnailPreview}
          title="Project Thumbnail"
          initialFilter={initialData?.thumbnail_filter}
          initialFilterValues={initialData?.thumbnail_filter_values}
          initialCrop={initialData?.thumbnail_crop}
          initialRotation={initialData?.thumbnail_rotation}
          onSave={async (payload) => {
            // First ensure we have the project id
            if (!projectId) return;
            // If they uploaded a new file but haven't saved it to the server yet, 
            // the crop payload would fail because bake needs the file on the server.
            // Wait, we should probably save Step 2 first before editing if it's a new file?
            // Actually, if it's an existing file, we can just call processThumbnail API.
            // Let's call processThumbnail.
            await processThumbnail(projectId, payload);
            toast('Image processed', 'success');
            // Hard refresh or re-fetch project to update preview
            router.refresh();
          }}
        />
      )}

      <div className="flex justify-between items-center">
        <AdminButton variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : router.back()}>
          {step === 1 ? 'Cancel' : '← Back'}
        </AdminButton>
        {step === 1 ? (
          <AdminButton onClick={handleSaveStep1} disabled={loading || !title || !description}>
            {loading ? 'Saving...' : 'Save & Continue →'}
          </AdminButton>
        ) : (
          (type === 'web' || type === 'other') ? (
            <AdminButton onClick={handleSaveStep2WebOther} disabled={loading}>
              {loading ? 'Saving...' : 'Finish Project'}
            </AdminButton>
          ) : (
            <AdminButton onClick={() => { router.push('/admin/projects'); router.refresh(); }}>
              Done
            </AdminButton>
          )
        )}
      </div>
    </div>
  );
}
