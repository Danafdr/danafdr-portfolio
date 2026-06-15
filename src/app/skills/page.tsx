import type { Metadata } from "next";
import Header from "../../components/Header";
import Skills from "../../components/Skills";

export const metadata: Metadata = {
  title: "Skills — danafdr",
  description: "Web development, video editing, and motion graphics toolkit.",
};

export default function SkillsPage() {
  return (
    <main className="bg-paper min-h-screen flex flex-col">
      <Header />
      
      <div className="pt-16 max-w-7xl mx-auto w-full px-5 md:px-10">
        <h1 className="font-playfair text-[clamp(40px,6vw,80px)] font-black leading-[0.9] tracking-[-0.02em] mb-12">
          The <em className="italic font-normal text-ink2">toolkit</em>
        </h1>
        <Skills />
      </div>
    </main>
  );
}
