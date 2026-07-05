import Header from "../components/Header";
import Hero from "../components/Hero";
import Tape from "../components/Tape";
import PullQuote from "../components/PullQuote";
import About from "../components/About";
import Work from "../components/Work";
import Now from "../components/Now";
import Contact from "../components/Contact";
import RevealManager from "../components/RevealManager";
import { prisma } from "../lib/prisma";

export const revalidate = 0;

async function getHeroSettings() {
  try {
    const hero = await prisma.hero_settings.findFirst();
    return hero || null;
  } catch (e) {
    console.error('Failed to fetch hero settings', e);
    return null;
  }
}

export default async function Home() {
  const heroSettings = await getHeroSettings();

  return (
    <main className="w-full flex flex-col gap-24 md:gap-32 pb-24">
      <div className="flex flex-col">
        <Header />
        <Hero heroSettings={heroSettings} />
      </div>
      <Tape />
      <div className="w-full max-w-[1920px] mx-auto"><PullQuote /></div>
      <div className="w-full max-w-[1920px] mx-auto"><About /></div>
      <div className="w-full max-w-[1920px] mx-auto"><Work /></div>
      <div className="w-full max-w-[1920px] mx-auto"><Now /></div>
      <div className="w-full max-w-[1920px] mx-auto"><Contact /></div>
      <RevealManager />
    </main>
  );
}
