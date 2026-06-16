import FilmReel from "../../components/FilmReel";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — danafdr",
  description: "Selected web development and motion graphics work.",
};

export default function WorkPage() {
  return (
    <main className="bg-paper h-[100dvh] overflow-hidden w-full fixed inset-0">
      <Suspense fallback={<div className="w-full h-full bg-paper" />}>
        <FilmReel />
      </Suspense>
    </main>
  );
}
