'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { getAdminProjects } from '@/lib/api';

export default function EditProjectPage() {
  const params = useParams();
  const id = Number(params.id);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProjects()
      .then((projects: any[]) => {
        const project = projects.find(p => String(p.id) === String(id));
        if (project) setInitialData(project);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return null;
  if (!initialData) return <div className="text-admin-ink font-mono py-20 text-center text-[12px]">Project not found</div>;

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-playfair text-[24px] text-admin-ink italic mb-2">Edit Project</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-admin-ink2">
          {initialData.title}
        </p>
      </div>
      <ProjectForm initialData={initialData} isEdit />
    </div>
  );
}
