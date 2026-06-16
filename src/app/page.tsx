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
    <main className="w-full">
      <Header />
      <div className="px-5 md:px-0 mt-8 mb-16 md:mt-0 md:mb-0"><Hero heroSettings={heroSettings} /></div>
      <Tape />
      <div className="px-5 md:px-0 mt-24 mb-12 md:mt-0 md:mb-0"><PullQuote /></div>
      <div className="px-5 md:px-0 mt-24 mb-12 md:mt-0 md:mb-0"><About /></div>
      <div className="px-5 md:px-0 mt-24 mb-12 md:mt-0 md:mb-0"><Work /></div>
      <div className="px-5 md:px-0 mt-24 mb-12 md:mt-0 md:mb-0"><Now /></div>
      <div className="px-5 md:px-0 mt-24 mb-12 md:mt-0 md:mb-0"><Contact /></div>
      <RevealManager />
    </main>
  );
}
