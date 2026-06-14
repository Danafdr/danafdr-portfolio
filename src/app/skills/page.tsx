import type { Metadata } from "next";
import Header from "../../components/Header";
import RevealManager from "../../components/RevealManager";

export const metadata: Metadata = {
  title: "Skills & Capabilities — danafdr",
  description: "Web development, video editing, and motion graphics toolkit.",
};

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

export default function SkillsPage() {
  return (
    <main className="bg-paper min-h-[100dvh] flex flex-col relative selection:bg-accent selection:text-paper">
      <RevealManager />
      <Header />
      
      <div className="pt-[120px] pb-32 max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-16">
        
        {/* Header Section */}
        <div className="mb-20 md:mb-32 reveal">
          <div className="reveal-child text-[10px] md:text-[11px] text-accent tracking-[0.2em] uppercase mb-6 flex items-center gap-4">
            <span>Capabilities</span>
            <span className="w-12 h-px bg-accent/30"></span>
          </div>
          <h1 className="reveal-child font-playfair text-[52px] md:text-[80px] lg:text-[110px] font-black leading-[0.9] tracking-[-0.03em] mb-8 text-ink">
            The <em className="italic font-normal text-ink2">toolkit</em>
          </h1>
          <p className="reveal-child font-mono text-[13px] md:text-[15px] text-ink2 leading-[1.8] max-w-[650px]">
            A cross-disciplinary approach to digital creation. Combining deep engineering with cinematic visual standards to build experiences that don't just work, but feel exactly right.
          </p>
        </div>

        {/* Skills List */}
        <div className="flex flex-col gap-0 border-t border-[rgba(15,14,11,0.1)]">
          {SKILL_CATEGORIES.map((category, idx) => (
            <div 
              key={idx} 
              className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-10 lg:gap-20 py-16 md:py-24 border-b border-[rgba(15,14,11,0.1)] reveal group"
            >
              
              {/* Category Info */}
              <div className="lg:pr-10">
                <div className={`reveal-child w-8 h-[2px] ${category.color} mb-6 transition-transform origin-left group-hover:scale-x-[2] duration-500`}></div>
                <h2 className="reveal-child font-playfair text-[32px] md:text-[46px] font-black tracking-[-0.02em] mb-5 text-ink leading-[1]">
                  {category.title}
                </h2>
                <p className="reveal-child font-mono text-[12px] md:text-[14px] text-ink2 leading-[1.8] max-w-[400px]">
                  {category.description}
                </p>
              </div>

              {/* Tools Grid */}
              <div className="reveal-child grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
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

      </div>
    </main>
  );
}
