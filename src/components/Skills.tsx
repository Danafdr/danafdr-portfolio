const SKILL_CATEGORIES = [
  {
    title: "Web Engineering",
    color: "bg-accent",
    description: "Architecting robust, scalable web applications with modern tech stacks. Focused on high-performance frontends, seamless interactions, and structured APIs.",
    groups: [
      {
        name: "Core Stack",
        items: ["Next.js", "React", "Laravel", "Inertia.js", "PHP"]
      },
      {
        name: "Styling & UI",
        items: ["Tailwind CSS", "Framer Motion", "GSAP", "Radix UI"]
      },
      {
        name: "Backend & DB",
        items: ["PostgreSQL", "MySQL", "Prisma ORM", "RESTful APIs"]
      },
      {
        name: "Infrastructure",
        items: ["Vercel", "GitHub Actions", "Git", "Linux"]
      }
    ]
  },
  {
    title: "Video Editing",
    color: "bg-[#a06030]",
    description: "Crafting narratives through cinematic cuts. Emphasizing pacing, rhythm, and emotional resonance to transform raw footage into compelling stories.",
    groups: [
      {
        name: "Primary Tools",
        items: ["Premiere Pro", "DaVinci Resolve"]
      },
      {
        name: "Techniques",
        items: ["Timeline Cutting", "Rhythm & Pacing", "Color Grading", "Sound Design"]
      },
      {
        name: "Formats",
        items: ["Short Films", "Product Reels", "Documentary Style", "Social Fast-Cuts"]
      }
    ]
  },
  {
    title: "Motion Graphics",
    color: "bg-ink3",
    description: "Designing dynamic visual experiences. Utilizing 2D and 3D pipelines to create premium, SaaS-style product motion and typography animations.",
    groups: [
      {
        name: "Animation Tools",
        items: ["After Effects", "Cinema 4D", "Blender"]
      },
      {
        name: "Specialties",
        items: ["SaaS Product Motion", "Apple-Style UI Reveal", "Kinetic Typography", "Title Sequences"]
      },
      {
        name: "Integration",
        items: ["Lottie / Bodymovin", "Web Animations", "Video Compositing"]
      }
    ]
  },
  {
    title: "Adjacent Skills",
    color: "bg-ink2",
    description: "Complementary disciplines that inform the creative process and ensure a holistic approach to digital media production.",
    groups: [
      {
        name: "Camera Work",
        items: ["Cinematography", "Photography", "Lighting Setup"]
      },
      {
        name: "Design",
        items: ["Figma", "UI/UX Design", "Wireframing"]
      },
      {
        name: "Networking",
        items: ["Cisco JS Essentials", "Server Management"]
      }
    ]
  }
];

export default function Skills() {
  return (
    <div className="flex flex-col gap-0 border-t border-[rgba(15,14,11,0.1)]">
      {SKILL_CATEGORIES.map((category, idx) => (
        <div 
          key={idx} 
          className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-10 lg:gap-20 py-16 md:py-24 border-b border-[rgba(15,14,11,0.1)] group"
        >
          {/* Category Info */}
          <div className="lg:pr-10">
            <div className={`w-8 h-[2px] ${category.color} mb-6 transition-transform origin-left group-hover:scale-x-[2] duration-500`}></div>
            <h2 className="font-playfair text-[32px] md:text-[46px] font-black tracking-[-0.02em] mb-5 text-ink leading-[1]">
              {category.title}
            </h2>
            <p className="font-mono text-[12px] md:text-[14px] text-ink2 leading-[1.8] max-w-[400px]">
              {category.description}
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
            {category.groups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="text-[10px] font-mono text-ink3 tracking-[0.15em] uppercase mb-5 pb-3 border-b border-[rgba(15,14,11,0.05)]">
                  {group.name}
                </div>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item, itemIdx) => (
                    <li 
                      key={itemIdx}
                      className="font-mono text-[13px] text-ink relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-1 before:h-1 before:bg-ink3 before:rounded-full group-hover:before:bg-accent before:transition-colors duration-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
