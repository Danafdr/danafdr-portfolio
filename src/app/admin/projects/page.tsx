'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAdminProjects, toggleProject, reorderProjects, deleteProject } from '@/lib/api';
import { toast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  type: string;
  published: boolean;
  featured: boolean;
  order: number;
}

function SortableItem({
  project,
  onToggle,
  onDelete,
  isSortable,
}: {
  project: ProjectItem;
  onToggle: (id: number, field: string) => void;
  onDelete: (id: number) => void;
  isSortable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`admin-project-row bg-bg2 border ${isDragging ? 'border-accent shadow-xl scale-[1.02]' : 'border-border'} p-4 flex items-center gap-4 group transition-all`}
    >
      {/* Drag Handle */}
      {isSortable ? (
        <div {...attributes} {...listeners} className="cursor-grab p-2 text-admin-ink3 hover:text-admin-ink active:cursor-grabbing">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="2" cy="2" r="1.5" />
            <circle cx="2" cy="6" r="1.5" />
            <circle cx="2" cy="10" r="1.5" />
            <circle cx="10" cy="2" r="1.5" />
            <circle cx="10" cy="6" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
          </svg>
        </div>
      ) : (
        <div className="p-2 opacity-0">
          <svg width="12" height="12" viewBox="0 0 12 12" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-mono text-[12px] text-admin-ink">{project.title}</h3>
        <p className="font-mono text-[9px] text-admin-ink2 uppercase tracking-[0.1em]">{project.type} / {project.slug}</p>
      </div>

      {/* Toggles */}
      <div className="flex items-center mr-4">
        <label className="admin-toggle-row flex items-center gap-2">
          <span className="font-mono text-[9px] text-admin-ink3 uppercase">Featured</span>
          <button
            onClick={() => onToggle(project.id, 'featured')}
            className={`w-8 h-4 rounded-full p-[2px] transition-colors ${project.featured ? 'bg-accent' : 'bg-admin-ink3'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-bg transition-transform ${project.featured ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </label>
        
        <label className="admin-toggle-row flex items-center gap-2">
          <span className="font-mono text-[9px] text-admin-ink3 uppercase">Published</span>
          <button
            onClick={() => onToggle(project.id, 'published')}
            className={`w-8 h-4 rounded-full p-[2px] transition-colors ${project.published ? 'bg-accent' : 'bg-admin-ink3'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-bg transition-transform ${project.published ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href={`/admin/projects/${project.id}/edit`} className="px-3 py-1 border border-border text-[10px] uppercase font-mono text-admin-ink2 hover:bg-admin-ink hover:text-bg hover:border-admin-ink transition-colors">
          Edit
        </Link>
        <button onClick={() => onDelete(project.id)} className="text-[10px] uppercase font-mono text-accent hover:opacity-80">
          Del
        </button>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchProjects = () => {
    setLoading(true);
    getAdminProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      const orderPayload = newProjects.map((p, i) => ({ id: p.id, order: i }));
      try {
        await reorderProjects(orderPayload);
        toast('Order saved', 'success');
      } catch {
        toast('Failed to save order', 'error');
        fetchProjects(); // revert
      }
    }
  };

  const handleToggle = async (id: number, field: string) => {
    // Guard: max 3 featured projects
    if (field === 'featured') {
      const project = projects.find(p => String(p.id) === String(id));
      if (project && !project.featured) {
        const featuredCount = projects.filter(p => p.featured).length;
        if (featuredCount >= 3) {
          toast('Featured limit reached — a maximum of 3 projects may be featured at any time. Please unfeature an existing project before featuring a new one.', 'error');
          return;
        }
      }
    }

    // optimistic
    setProjects(projects.map(p => String(p.id) === String(id) ? { ...p, [field]: !(p as any)[field] } : p));
    try {
      await toggleProject(id, field);
      toast(`${field} updated`, 'success');
    } catch {
      toast('Update failed', 'error');
      fetchProjects(); // revert
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      toast('Project deleted', 'success');
      setProjects(projects.filter((p) => String(p.id) !== String(deleteId)));
      setDeleteId(null);
    } catch {
      toast('Failed to delete', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return null;

  const uniqueTypes = Array.from(new Set(projects.map(p => p.type)));
  const filteredProjects = projects.filter(p => filterType === 'all' || p.type === filterType);

  return (
    <div className="animate-fi">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-[24px] text-admin-ink italic mb-2">Projects</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-admin-ink2">
            {filterType === 'all' ? 'Drag to reorder' : 'Sorting disabled while filtered'}
          </p>
        </div>
        <Link href="/admin/projects/create" className="bg-accent text-bg font-mono text-[11px] uppercase tracking-[0.1em] px-6 py-3 hover:opacity-85 transition-opacity">
          Add New Project
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`filter-pill font-mono text-[10px] uppercase px-4 py-2 whitespace-nowrap ${filterType === 'all' ? 'active' : ''}`}
        >
          All Projects
        </button>
        {uniqueTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`filter-pill font-mono text-[10px] uppercase px-4 py-2 whitespace-nowrap ${filterType === type ? 'active' : ''}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProjects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {filteredProjects.map((project) => (
              <SortableItem
                key={project.id}
                project={project}
                onToggle={handleToggle}
                onDelete={(id) => setDeleteId(id)}
                isSortable={filterType === 'all'}
              />
            ))}
          </SortableContext>
        </DndContext>

        {projects.length === 0 && (
          <div className="py-20 text-center border border-border border-dashed">
            <p className="font-mono text-[11px] text-admin-ink2 uppercase tracking-[0.1em]">No projects found.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project?"
        message="This action cannot be undone. All associated images will be permanently removed."
        confirmText="DELETE"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
