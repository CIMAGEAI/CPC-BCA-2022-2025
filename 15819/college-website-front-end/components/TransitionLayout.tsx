// components/TransitionLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// ✅ Dynamically import Loader with SSR disabled
const Loader = dynamic(() => import("./loader"), {
  ssr: false,
});

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <Loader/>}
      <div className={loading ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-100"}>
        {children}
      </div>
    </>
  );
}
