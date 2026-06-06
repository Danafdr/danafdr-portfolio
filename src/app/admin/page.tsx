'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStats, getAdminProjects } from '@/lib/api';
import { Layers, Briefcase, PlaySquare, PenTool, ArrowRight, Activity, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, featured: 0, drafts: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats(),
      getAdminProjects()
    ])
      .then(([statsData, projectsData]) => {
        if (statsData) setStats(statsData);
        if (projectsData) setRecentProjects(projectsData.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="w-8 h-8 border border-admin-ink/20 border-t-admin-ink rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fi max-w-[1200px]">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-playfair text-[32px] md:text-[40px] text-admin-ink italic mb-2 leading-none">Dashboard</h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-ink2">
            Portfolio Overview & Activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="border border-border text-admin-ink font-mono text-[11px] uppercase tracking-[0.1em] px-5 py-3 hover:border-[rgba(240,235,226,0.2)] transition-colors flex items-center gap-2">
            <Layers size={14} /> View All
          </Link>
          <Link href="/admin/projects/create" className="bg-accent text-bg font-mono text-[11px] uppercase tracking-[0.1em] px-5 py-3 hover:opacity-85 transition-opacity flex items-center gap-2">
            <Plus size={14} /> New Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Projects', value: stats.total, icon: <Briefcase size={16} /> },
          { label: 'Published', value: stats.published, icon: <PlaySquare size={16} /> },
          { label: 'Featured', value: stats.featured, icon: <Activity size={16} /> },
          { label: 'Drafts', value: stats.drafts, icon: <PenTool size={16} /> },
        ].map((s, i) => (
          <div key={i} className="bg-bg2 border border-border p-6 flex flex-col gap-6 group hover:border-[rgba(240,235,226,0.15)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-admin-ink2/10 group-hover:text-admin-ink2/20 transition-colors transform group-hover:scale-110 duration-500">
              {s.icon}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-admin-ink3 group-hover:text-admin-ink2 transition-colors relative z-10">
              {s.label}
            </span>
            <span className="font-bebas text-[56px] leading-none text-admin-ink relative z-10">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-playfair text-[20px] text-admin-ink italic">Recent Activity</h2>
            <Link href="/admin/projects" className="text-admin-ink3 hover:text-admin-ink flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors">
              See All <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-3">
            {recentProjects.length > 0 ? (
              recentProjects.map((project: any) => (
                <Link 
                  key={project.id} 
                  href={`/admin/projects/${project.id}/edit`}
                  className="bg-bg2 border border-border p-4 flex items-center gap-5 hover:border-[rgba(240,235,226,0.15)] transition-all group"
                >
                  <div 
                    className="w-[48px] h-[32px] shrink-0 border border-border/50"
                    style={{ background: `linear-gradient(135deg, ${project.gradient_start || '#111'}, ${project.gradient_end || '#222'})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair text-[16px] text-admin-ink truncate mb-1 group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-admin-ink3 truncate">{project.type}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${project.status === 'published' ? 'text-accent border-accent/20 bg-accent/5' : 'text-admin-ink3 border-border'}`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-bg2 border border-border p-10 text-center flex flex-col items-center justify-center text-admin-ink3">
                <Briefcase size={24} className="mb-4 opacity-50" />
                <p className="font-mono text-[11px] uppercase tracking-widest mb-4">No projects found</p>
                <Link href="/admin/projects/create" className="text-accent hover:underline font-mono text-[10px] uppercase tracking-widest">
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className="font-playfair text-[20px] text-admin-ink italic">System</h2>
          </div>
          <div className="bg-bg2 border border-border p-6 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-[6px] shrink-0 animate-pulse" />
              <div>
                <h4 className="font-playfair text-[15px] text-admin-ink mb-1">Database Connected</h4>
                <p className="font-mono text-[10px] text-admin-ink3 leading-relaxed">Laravel API is running smoothly on localhost:8000. All systems operational.</p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-border" />
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-admin-ink3 mt-[6px] shrink-0" />
              <div>
                <h4 className="font-playfair text-[15px] text-admin-ink mb-1">Media Storage</h4>
                <p className="font-mono text-[10px] text-admin-ink3 leading-relaxed">Local disk storage active. S3 bucket integration available in configuration.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
