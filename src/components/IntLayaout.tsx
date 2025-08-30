import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function IntLayaout({ children }: LayoutProps) {
  return (
    <>
      <div className="min-h-dvh w-full bg-stone-50 text-gray-800 flex flex-col">
        {/* Header (si es fixed, agrega pt-14 al <main>) */}
        <Header />

        <main className="flex-1 w-full">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
