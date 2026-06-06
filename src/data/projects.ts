export interface Project {
  id: string;
  typeBadge: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  link?: string;
  hasCaseStudy: boolean;
  visualTitle?: string;
  visualSubtitle?: string;
  gradientStart?: string;
  gradientEnd?: string;
  media?: string[];
}

export const projects: Project[] = [
  {
    id: "01",
    typeBadge: "Web Application",
    title: "TaskFlow",
    description: "A project management platform built with Laravel and React via Inertia.js. Real-time task boards, team collaboration, and deadline tracking — deployed on Vercel.",
    tags: ["Laravel", "React", "Inertia", "MySQL"],
    year: "2024",
    hasCaseStudy: false,
    visualTitle: "Dashboard Overview",
    visualSubtitle: "Web App",
    gradientStart: "#1a1a2e",
    gradientEnd: "#16213e"
  },
  {
    id: "02",
    typeBadge: "Motion Graphics",
    title: "Aether Reel",
    description: "A 90-second product reel for a fictional SaaS brand. Apple-style motion language — smooth camera moves, depth of field, and typographic reveals in After Effects with Element 3D.",
    tags: ["AE", "E3D", "C4D", "Premiere"],
    year: "2024",
    hasCaseStudy: false,
    visualTitle: "Hero Shot — 0:14",
    visualSubtitle: "Motion",
    gradientStart: "#0f0f0f",
    gradientEnd: "#2d1b4e"
  },
  {
    id: "03",
    typeBadge: "Next.js Project",
    title: "Kaizen",
    description: "A minimal habit-tracking landing page. Server-rendered with Next.js, animated with GSAP ScrollTrigger, and deployed live on Vercel. Dark mode, micro-interactions, editorial layout.",
    tags: ["Next.js", "GSAP", "Vercel"],
    year: "2025",
    link: "https://kaizen.vercel.app",
    hasCaseStudy: false,
    visualTitle: "Landing Hero",
    visualSubtitle: "Frontend",
    gradientStart: "#0a0a0a",
    gradientEnd: "#1b3a2a"
  },
  {
    id: "04",
    typeBadge: "Video Editing",
    title: "VOID",
    description: "Title sequence for a short film. Heavy use of Premiere Pro for pacing, After Effects for typographic animation, and Blender for a single abstract 3D element composited back into the edit.",
    tags: ["Premiere", "AE", "Blender"],
    year: "2025",
    hasCaseStudy: false,
    visualTitle: "Main Title — Frame",
    visualSubtitle: "Title Seq",
    gradientStart: "#0f0e0b",
    gradientEnd: "#1a1a1a"
  },
  {
    id: "05",
    typeBadge: "Web Application",
    title: "Pulse",
    description: "Analytics dashboard for a fitness startup. Laravel API powering a React frontend via Inertia — real-time charts, user segmentation, and export pipelines.",
    tags: ["Laravel", "React", "Inertia", "Chart.js"],
    year: "2025",
    hasCaseStudy: true,
    visualTitle: "Analytics View",
    visualSubtitle: "Dashboard",
    gradientStart: "#1a0a0a",
    gradientEnd: "#2e1a1a"
  },
  {
    id: "06",
    typeBadge: "This Portfolio",
    title: "Boys Don't Cry",
    description: "The site you're looking at. Editorial meets web craft — no template, never will be. Next.js, GSAP, Framer Motion, and obsessive attention to typography and spacing.",
    tags: ["Next.js", "GSAP", "Framer Motion"],
    year: "2025",
    hasCaseStudy: false,
    visualTitle: "Design System",
    visualSubtitle: "Portfolio",
    gradientStart: "#f0ebe2",
    gradientEnd: "#e0d8cc"
  }
];
