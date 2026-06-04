import Intro from "../components/Intro";
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

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <Hero />
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
