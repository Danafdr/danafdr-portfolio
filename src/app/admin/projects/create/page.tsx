import { ProjectForm } from '@/components/admin/ProjectForm';

export default function CreateProjectPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-playfair text-[24px] text-admin-ink italic mb-2">New Project</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-admin-ink2">
          Create a new portfolio item
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
