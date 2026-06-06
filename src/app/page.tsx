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

async function getHeroSettings() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/hero-settings', {
      next: { revalidate: 1800 }
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Failed to fetch hero settings', e);
  }
  return null;
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
