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
    // In server components, fetch needs absolute URLs.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/hero`, {
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
