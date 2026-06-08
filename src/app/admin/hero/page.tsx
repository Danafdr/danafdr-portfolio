"use client";

import { useState, useEffect } from 'react';
import { AdminButton } from '@/components/admin/AdminButton';
import { toast } from '@/components/admin/Toast';
import { getHeroSetting, uploadHeroPhoto, updateHeroPhoto, deleteHeroPhoto } from '@/lib/api';
import ImageEditor from '@/components/ImageEditor';

export default function HeroAdminPage() {
  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHeroSetting();
      setSetting(data);
    } catch (e) {
      console.error(e);
      toast('Failed to load hero setting', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const data = await uploadHeroPhoto(formData);
      setSetting(data);
      toast('Hero photo uploaded', 'success');
      setEditorOpen(true);
    } catch (err: any) {
      toast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCssFilter = () => {
    if (setting?.filter_mode === 'baked') return 'none';
    if (!setting?.filter_values && !setting?.filter) return 'none';
    const PRESETS = [
      { id: 'original', css: 'none' },
      { id: 'grainy', css: 'contrast(1.1) brightness(0.95) saturate(0.9)' },
      { id: 'warm', css: 'sepia(0.15) saturate(1.1) brightness(1.05) contrast(0.95)' },
      { id: 'desaturated', css: 'saturate(0.3) contrast(1.05) brightness(1.02)' },
      { id: 'dark', css: 'brightness(0.82) contrast(1.2) saturate(0.85)' },
      { id: 'fade', css: 'brightness(1.1) contrast(0.82) saturate(0.75)' },
    ];
    let presetCss = PRESETS.find(p => p.id === setting?.filter)?.css || 'none';
    let base = presetCss !== 'none' ? presetCss + ' ' : '';
    if (setting?.filter_values?.brightness) base += `brightness(${1 + setting.filter_values.brightness/100}) `;
    if (setting?.filter_values?.contrast) base += `contrast(${1 + setting.filter_values.contrast/100}) `;
    return base.trim() || 'none';
  };

  if (loading && !setting) return <div className="p-10 font-mono text-[10px] text-admin-ink2 uppercase tracking-[0.1em]">Loading...</div>;

  const hasPhoto = !!setting?.photo_url;
  const isCssMode = setting?.filter_mode === 'css';
  const showGrain = isCssMode && setting?.filter_values?.grain > 0;

  return (
    <>
      <div className="max-w-4xl animate-fi pb-24">
        <div className="mb-8 border-b border-border pb-4">
        <h1 className="font-playfair text-[28px] italic text-admin-ink">Hero Photo</h1>
        <p className="font-mono text-[10px] text-admin-ink3 mt-1">Manages the photo placeholder on the home page hero section.</p>
      </div>

      {/* Live Preview Section */}
      <div className="mb-12">
        <div className="font-mono text-[9px] text-admin-ink3 uppercase mb-3 tracking-[0.1em]">Live preview</div>
        <div className="w-full bg-paper border border-border overflow-hidden relative" style={{ height: '400px' }}>
          {/* Scaled down preview wrapper */}
          <div className="absolute top-0 left-0 w-[1200px] origin-top-left pointer-events-none" style={{ transform: 'scale(0.65)' }}>
            <div className="px-10 grid grid-cols-2 gap-0 relative flex-1 pt-12">
              <div className="pr-10 border-r border-border-rgba relative z-10 flex flex-col justify-center py-[4vh]">
                <div className="text-[9px] text-accent tracking-[0.3em] uppercase mb-[4vh] font-mono">Portfolio — Issue No. 001</div>
                <h1 className="font-playfair text-[90px] font-black leading-[0.86] tracking-[-0.03em] flex flex-col text-ink">
                  <span className="block">CODES</span>
                  <span className="block"><em className="italic font-normal text-ink2">&amp; moves</em></span>
                  <span className="block">THINGS</span>
                </h1>
              </div>
              <div className="pl-10 flex flex-col justify-between relative py-[4vh]">
                <div className="absolute top-0 right-0 w-[200px] h-[288.8px] bg-[rgba(15,14,11,0.05)] border border-border-rgba z-0 overflow-hidden flex items-center justify-center">
                  {!hasPhoto ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] text-ink3 uppercase tracking-[0.2em] text-center px-4 font-mono">
                      <span>Photo</span>
                      <span>Placeholder</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-full relative overflow-hidden bg-ink">
                        <img 
                          src={setting.photo_url} 
                          className="absolute max-w-none"
                          style={{
                            filter: getCssFilter(),
                            transform: `rotate(${setting.rotation || 0}deg)`,
                            ...(setting.crop && isCssMode ? {
                              width: `${(setting.width / setting.crop.width) * 100}%`,
                              height: `${(setting.height / setting.crop.height) * 100}%`,
                              left: `-${(setting.crop.x / setting.crop.width) * 100}%`,
                              top: `-${(setting.crop.y / setting.crop.height) * 100}%`
                            } : {
                              width: '100%', height: '100%', objectFit: 'cover'
                            })
                          }}
                          alt=""
                        />
                        {showGrain && (
                          <div 
                            className="absolute inset-0 pointer-events-none mix-blend-overlay"
                            style={{
                              backgroundImage: `url('/storage/assets/grain.png')`,
                              opacity: setting.filter_values.grain / 100,
                            }}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Management Section */}
      <div className="grid grid-cols-2 gap-10 border-t border-border pt-10">
        {/* Left Col */}
        <div className="flex flex-col gap-4">
          {!hasPhoto ? (
            <div className="border border-dashed border-border aspect-[9/13] w-[200px] flex flex-col items-center justify-center gap-4 bg-bg2">
              <span className="font-mono text-[10px] text-admin-ink3 text-center px-4">No photo uploaded</span>
              <label className="cursor-pointer">
                <span className="bg-admin-ink text-bg px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] hover:bg-opacity-90 transition-colors">
                  Upload photo +
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-[9/13] overflow-hidden bg-bg2 border border-border">
                <img 
                  src={setting.photo_url} 
                  className="absolute max-w-none"
                  style={{
                    filter: getCssFilter(),
                    transform: `rotate(${setting.rotation || 0}deg)`,
                    ...(setting.crop && isCssMode ? {
                      width: `${(setting.width / setting.crop.width) * 100}%`,
                      height: `${(setting.height / setting.crop.height) * 100}%`,
                      left: `-${(setting.crop.x / setting.crop.width) * 100}%`,
                      top: `-${(setting.crop.y / setting.crop.height) * 100}%`
                    } : {
                      width: '100%', height: '100%', objectFit: 'cover'
                    })
                  }}
                  alt="Hero Management"
                />
                {showGrain && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                      backgroundImage: `url('/storage/assets/grain.png')`,
                      opacity: setting.filter_values.grain / 100,
                    }}
                  />
                )}
                <div className="absolute bottom-4 left-4 bg-[#0f0e0b] border border-[rgba(240,235,226,0.1)] px-3 py-1 font-mono text-[8px] text-admin-ink3 uppercase tracking-[0.1em] rounded-full">
                  {setting.filter || 'Original'} · {isCssMode ? 'Live CSS' : 'Baked'}
                </div>
              </div>

              <div className="flex gap-4">
                <AdminButton onClick={() => setEditorOpen(true)} className="flex-1 text-center justify-center">
                  Edit crop & filter →
                </AdminButton>
                <label className="cursor-pointer flex-1">
                  <div className="w-full h-full border border-border text-admin-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] hover:bg-border transition-colors flex items-center justify-center text-center">
                    Replace photo
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div className="font-mono text-[9px] text-admin-ink3 leading-[1.9]">
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Photo:</span>
            <span className="truncate">{hasPhoto ? setting.original_path?.split('/').pop() || 'uploaded.jpg' : '—'}</span>
          </div>
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Dimensions:</span>
            <span>{hasPhoto ? `${setting.width || 0} × ${setting.height || 0}px` : '—'}</span>
          </div>
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Crop:</span>
            <span>{hasPhoto && setting.crop ? `${Math.round(setting.crop.width)} × ${Math.round(setting.crop.height)} from (${Math.round(setting.crop.x)}, ${Math.round(setting.crop.y)})` : '—'}</span>
          </div>
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Rotation:</span>
            <span>{hasPhoto ? `${setting.rotation || 0}°` : '—'}</span>
          </div>
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Filter:</span>
            <span className="capitalize">{hasPhoto && setting.filter ? setting.filter : '—'}</span>
          </div>
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Mode:</span>
            <span>{hasPhoto ? (setting.filter_mode === 'css' ? 'Live CSS filter' : 'Baked into image') : '—'}</span>
          </div>
          <div className="flex mb-[2px]">
            <span className="w-24 shrink-0 text-admin-ink2">Last edited:</span>
            <span>{hasPhoto && setting.updated_at ? new Date(setting.updated_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
          </div>
          
          {hasPhoto && (
            <div className="mt-8">
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="text-red-500 hover:text-red-400 uppercase tracking-[0.1em] text-[9px] underline underline-offset-2">
                  Remove photo entirely
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-admin-ink2 uppercase tracking-[0.1em] text-[9px]">Are you sure?</span>
                  <button onClick={async () => {
                    await deleteHeroPhoto();
                    loadData();
                    setConfirmDelete(false);
                  }} className="text-red-500 hover:text-red-400 uppercase tracking-[0.1em] text-[9px] underline underline-offset-2 font-bold">
                    Yes, remove
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="text-admin-ink3 hover:text-admin-ink uppercase tracking-[0.1em] text-[9px] underline underline-offset-2">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      <ImageEditor 
        isOpen={editorOpen} 
        onClose={() => setEditorOpen(false)}
        imageUrl={setting?.photo_url || ''}
        title="Hero Photo"
        initialFilter={setting?.filter}
        initialFilterValues={setting?.filter_values}
        initialCrop={setting?.crop}
        initialRotation={setting?.rotation}
        recommendedRatio="9:13"
        onSave={async (payload) => {
          await updateHeroPhoto(payload);
          toast('Hero photo updated', 'success');
          loadData();
        }}
      />
    </>
  );
}
