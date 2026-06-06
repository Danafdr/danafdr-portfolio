"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  imageUrl: string;
  title: string;
  initialCrop?: Crop | null;
  initialFilter?: string | null;
  initialFilterValues?: any | null;
  initialRotation?: number;
  recommendedRatio?: string;
}

const PRESETS = [
  { id: 'original', name: 'Original', css: 'none' },
  { id: 'grainy', name: 'Grainy', css: 'contrast(1.1) brightness(0.95) saturate(0.9)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.15) saturate(1.1) brightness(1.05) contrast(0.95)' },
  { id: 'desaturated', name: 'Desaturated', css: 'saturate(0.3) contrast(1.05) brightness(1.02)' },
  { id: 'dark', name: 'Dark', css: 'brightness(0.82) contrast(1.2) saturate(0.85)' },
  { id: 'fade', name: 'Fade', css: 'brightness(1.1) contrast(0.82) saturate(0.75)' },
];

const RATIOS = [
  { id: 'free', label: 'Free', value: undefined },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4/3 },
  { id: '3:2', label: '3:2', value: 3/2 },
  { id: '16:9', label: '16:9', value: 16/9 },
  { id: '9:16', label: '9:16', value: 9/16 },
  { id: '9:13', label: '9:13', value: 9/13 },
];

export default function ImageEditor({
  isOpen, onClose, onSave, imageUrl, title,
  initialCrop, initialFilter, initialFilterValues, initialRotation, recommendedRatio
}: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop | undefined>(initialCrop || undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [rotation, setRotation] = useState(initialRotation || 0);
  const [filter, setFilter] = useState(initialFilter || 'original');
  const [brightness, setBrightness] = useState(initialFilterValues?.brightness || 0);
  const [contrast, setContrast] = useState(initialFilterValues?.contrast || 0);
  const [grain, setGrain] = useState(initialFilterValues?.grain || 0);
  const [saveMode, setSaveMode] = useState<'css' | 'bake'>('css');
  const [isSaving, setIsSaving] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCrop(initialCrop || undefined);
      setRotation(initialRotation || 0);
      setFilter(initialFilter || 'original');
      setBrightness(initialFilterValues?.brightness || 0);
      setContrast(initialFilterValues?.contrast || 0);
      setGrain(initialFilterValues?.grain || 0);
      setSaveMode('css');
      setAspect(undefined);
    }
  }, [isOpen, initialCrop, initialFilter, initialFilterValues, initialRotation]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    let scaleX = 1;
    let scaleY = 1;
    if (imgRef.current) {
      scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    }

    const payload = {
      mode: saveMode,
      filter,
      filter_values: { brightness, contrast, grain },
      crop: crop ? {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
        unit: 'px'
      } : null,
      rotation
    };

    try {
      await onSave(payload);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to save image edits.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCssFilter = () => {
    let presetCss = PRESETS.find(p => p.id === filter)?.css || 'none';
    let base = presetCss !== 'none' ? presetCss + ' ' : '';
    if (brightness !== 0) base += `brightness(${1 + brightness/100}) `;
    if (contrast !== 0) base += `contrast(${1 + contrast/100}) `;
    return base.trim() || 'none';
  };

  return (
    <div className="fixed inset-0 z-[800] bg-[#0f0e0b] flex flex-col font-mono text-ink">
      {/* Header */}
      <div className="h-[52px] border-b border-[rgba(240,235,226,0.07)] flex items-center justify-between px-6 shrink-0">
        <button onClick={onClose} className="text-[11px] text-ink2 hover:text-ink transition-colors uppercase tracking-[0.1em]">
          ← Cancel
        </button>
        <div className="text-[10px] text-ink2 uppercase tracking-[0.05em]">{title}</div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="text-[11px] bg-accent text-paper px-4 py-1.5 uppercase tracking-[0.1em] hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save changes →'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Canvas */}
        <div className="w-[60%] bg-[#1a1816] relative flex items-center justify-center p-8 overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            aspect={aspect}
            className="max-h-full max-w-full"
          >
            <div className="relative">
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Edit"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: getCssFilter(),
                  maxHeight: 'calc(100vh - 120px)',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
              {grain > 0 && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url('/storage/assets/grain.png')`,
                    opacity: grain / 100,
                    mixBlendMode: 'overlay',
                    transform: `rotate(${rotation}deg)`
                  }}
                />
              )}
            </div>
          </ReactCrop>
        </div>

        {/* Right Controls */}
        <div className="w-[40%] bg-[#0f0e0b] border-l border-[rgba(240,235,226,0.07)] p-[32px_28px] overflow-y-auto custom-scrollbar">
          
          {/* Aspect Ratio */}
          <div className="mb-10">
            <div className="text-[9px] text-ink3 uppercase tracking-[0.1em] mb-4 flex justify-between">
              <span>Aspect ratio</span>
              {recommendedRatio && <span className="text-accent italic text-[8px] lowercase">Recommended: {recommendedRatio}</span>}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {RATIOS.map(r => {
                // If there's a recommendedRatio like "9:13", we can dynamically inject it if not present
                return (
                  <button
                    key={r.id}
                    onClick={() => setAspect(r.value)}
                    className={`text-[10px] px-3 py-2 border transition-all ${
                      aspect === r.value 
                        ? 'border-accent text-ink bg-[rgba(200,68,26,0.1)]' 
                        : (recommendedRatio === r.id ? 'border-[rgba(240,235,226,0.2)] text-ink bg-[#1a1816]' : 'border-[rgba(240,235,226,0.08)] text-ink3 hover:bg-ink hover:text-[#0f0e0b]')
                    }`}
                  >
                    {r.label}
                  </button>
                )
              })}
            </div>
            {recommendedRatio === '9:13' && (
              <div className="text-[9px] text-ink3 mb-4 leading-relaxed">
                The crop preview on the canvas shows a faint outline of the safe zone so you know what the box will show.
              </div>
            )}
            <div className="flex gap-4">
              <button 
                onClick={() => setCrop(undefined)}
                className="text-[10px] text-ink2 border border-[rgba(240,235,226,0.2)] px-3 py-1.5 hover:text-ink transition-colors"
              >
                Reset crop
              </button>
              <button 
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="text-[10px] text-ink2 border border-[rgba(240,235,226,0.2)] px-3 py-1.5 hover:text-ink transition-colors"
              >
                Rotate 90°
              </button>
            </div>
          </div>

          {/* Filter Presets */}
          <div className="mb-10">
            <div className="text-[9px] text-ink3 uppercase tracking-[0.1em] mb-4">Filter</div>
            <div className="grid grid-cols-3 gap-3">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setFilter(p.id)}
                  className={`flex flex-col gap-2 transition-all group ${filter === p.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className={`w-full h-[50px] overflow-hidden rounded-[2px] border-2 transition-all ${filter === p.id ? 'border-accent' : 'border-transparent'}`}>
                    <img 
                      src={imageUrl} 
                      className="w-full h-full object-cover" 
                      style={{ filter: p.css }}
                      alt={p.name}
                    />
                  </div>
                  <span className={`text-[8px] uppercase tracking-[0.05em] text-center w-full ${filter === p.id ? 'text-ink' : 'text-ink3'}`}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
            {recommendedRatio === '9:13' && (
              <div className="mt-4 text-[9px] text-ink3 italic">
                Tip: Grainy or Desaturated work well with the editorial theme.
              </div>
            )}
          </div>

          {/* Sliders */}
          <div className="mb-10 space-y-6">
            <Slider label="Brightness" value={brightness} min={-50} max={50} onChange={setBrightness} />
            <Slider label="Contrast" value={contrast} min={-50} max={50} onChange={setContrast} />
            <Slider label="Grain" value={grain} min={0} max={100} onChange={setGrain} />
          </div>

          {/* Save Mode */}
          <div>
            <div className="text-[9px] text-ink3 uppercase tracking-[0.1em] mb-4">Save as</div>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-[2px]">
                  <input type="radio" checked={saveMode === 'css'} onChange={() => setSaveMode('css')} className="sr-only" />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${saveMode === 'css' ? 'border-accent' : 'border-[rgba(240,235,226,0.2)] group-hover:border-[rgba(240,235,226,0.4)]'}`}>
                    {saveMode === 'css' && <div className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-ink mb-1">Live CSS filter</div>
                  <div className="text-[9px] text-ink3 leading-[1.4]">Original file kept. Filter applied on display only. You can change or remove it any time.</div>
                  {recommendedRatio === '9:13' && (
                    <div className="text-[9px] text-ink3 mt-2 italic">Tip: Use Live CSS filter to keep editing flexibility.</div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-[2px]">
                  <input type="radio" checked={saveMode === 'bake'} onChange={() => setSaveMode('bake')} className="sr-only" />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${saveMode === 'bake' ? 'border-accent' : 'border-[rgba(240,235,226,0.2)] group-hover:border-[rgba(240,235,226,0.4)]'}`}>
                    {saveMode === 'bake' && <div className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-ink mb-1">Bake into image</div>
                  <div className="text-[9px] text-ink3 leading-[1.4]">Filter permanently applied to the saved file. Original cannot be recovered after saving.</div>
                  {saveMode === 'bake' && (
                    <div className="text-[9px] text-accent mt-2">⚠ This cannot be undone. Keep a backup of the original.</div>
                  )}
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(240,235,226,0.1); border-radius: 4px; }
        .ReactCrop__crop-selection { border: none !important; box-shadow: 0 0 0 9999em rgba(0,0,0,0.5); }
        .ReactCrop__drag-handle { width: 10px !important; height: 10px !important; background-color: #f0ebe2 !important; border: none !important; opacity: 1 !important; }
      `}} />
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] text-ink2">{label}</span>
        <span className="text-[9px] text-ink3">{value > 0 ? `+${value}` : value}</span>
      </div>
      <input 
        type="range" min={min} max={max} value={value} 
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-[2px] bg-[rgba(240,235,226,0.1)] appearance-none cursor-pointer outline-none"
        style={{
          background: `linear-gradient(to right, #c8441a 0%, #c8441a ${((value - min) / (max - min)) * 100}%, rgba(240,235,226,0.1) ${((value - min) / (max - min)) * 100}%, rgba(240,235,226,0.1) 100%)`
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #f0ebe2;
          cursor: pointer;
        }
      `}} />
    </div>
  );
}
