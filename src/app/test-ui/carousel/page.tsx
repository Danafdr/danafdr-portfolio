import Header from "@/components/Header";
import Footer from "@/components/Contact";
import Work from "@/components/Work";
import RevealManager from "@/components/RevealManager";

export default function TestPage() {
  return (
    <>
      <Header />
      <div className="pt-24 pb-12 px-10">
        <h1 className="font-playfair text-4xl mb-4">Testing Layout: Carousel</h1>
        <p className="font-mono text-sm text-ink2 mb-12">Clicking a category expands an inline horizontal carousel.</p>
      </div>
      <Work />
      <Footer />
      <RevealManager />
    </>
  );
}
