import Header from "../components/Header";
import Hero from "../components/Hero";
import Tape from "../components/Tape";
import PullQuote from "../components/PullQuote";
import About from "../components/About";
import Skills from "../components/Skills";
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
    <>
      <Header />
      <Hero heroSettings={heroSettings} />
      <Tape />
      <PullQuote />
      <About />
      <Skills />
      <Work />
      <Now />
      <Contact />
      <RevealManager />
    </>
  );
}
