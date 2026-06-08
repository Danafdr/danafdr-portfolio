import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from './Toast';

const GithubIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.39-3.6 5.2 5.2 0 0 0-.13-3.55s-1.14-.36-3.7 1.38a12.8 12.8 0 0 0-6.8 0c-2.56-1.74-3.7-1.38-3.7-1.38a5.2 5.2 0 0 0-.13 3.55 5.2 5.2 0 0 0-1.39 3.6c0 5.22 3 6.42 6 6.76A4.8 4.8 0 0 0 3 18v4"></path>
  </svg>
);

interface Repo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
}

interface GithubRepoSelectorProps {
  onSelect: (repo: Repo) => void;
}

export function GithubRepoSelector({ onSelect }: GithubRepoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadRepos = async () => {
    if (repos.length > 0) return;
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/github/repos');
      if (data && data.error) throw new Error(data.error);
      if (Array.isArray(data)) {
        setRepos(data);
      }
    } catch (e: any) {
      toast(e.message || 'Failed to load repositories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      loadRepos();
    }
    setIsOpen(!isOpen);
    setSearch('');
  };

  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-3 p-4 border border-border bg-bg relative">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-admin-ink">GitHub Repository</span>
          <span className="text-[10px] text-admin-ink3 mt-1">Select the repository to connect to your project</span>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-2 bg-bg2 border border-border px-3 py-2 text-[11px] font-mono hover:border-accent transition-colors text-admin-ink whitespace-nowrap min-w-[220px] justify-between"
          >
            <div className="flex items-center gap-2">
              <GithubIcon size={14} />
              <span>Choose GitHub repository</span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-[calc(100%+4px)] right-0 w-[300px] bg-bg2 border border-border shadow-lg z-50 flex flex-col max-h-[300px]">
              <div className="p-2 border-b border-border flex items-center gap-2 sticky top-0 bg-bg2 z-10">
                <Search size={14} className="text-admin-ink3 ml-1" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-mono text-admin-ink focus:outline-none w-full"
                  autoFocus
                />
              </div>
              
              <div className="overflow-y-auto flex-1 p-1">
                {loading ? (
                  <div className="p-4 text-center text-[10px] text-admin-ink3 animate-pulse">Loading...</div>
                ) : filteredRepos.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-admin-ink3">No repositories found</div>
                ) : (
                  filteredRepos.map(repo => (
                    <button
                      key={repo.name}
                      type="button"
                      onClick={() => {
                        onSelect(repo);
                        setIsOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-2 py-2 hover:bg-bg transition-colors group"
                    >
                      <GithubIcon size={14} className="text-admin-ink2 group-hover:text-admin-ink" />
                      <span className="text-[11px] font-mono text-admin-ink truncate">{repo.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
