import FilmReel from "../../components/FilmReel";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — danafdr",
  description: "Selected web development and motion graphics work.",
};

export default function WorkPage() {
  return (
    <main className="bg-paper min-h-[100dvh] w-full">
      <Suspense fallback={<div className="w-full h-[100dvh] bg-paper" />}>
        <FilmReel />
      </Suspense>
    </main>
  );
}
