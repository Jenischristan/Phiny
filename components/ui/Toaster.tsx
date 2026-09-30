'use client';

import React, { useEffect, useState } from 'react';

let pushToast: (m: string) => void = () => {};

export const toast = (m: string) => pushToast(m);

export function Toaster() {
  const [t, setT] = useState<{ m: string; k: number } | null>(null);

  useEffect(() => {
    pushToast = (m: string) => setT({ m, k: Date.now() });
  }, []);

  useEffect(() => {
    if (!t) return;
    const id = setTimeout(() => setT(null), 2400);
    return () => clearTimeout(id);
  }, [t]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[70]"
    >
      {t && (
        <div key={t.k} className="rise bg-fg text-bg px-4 py-3 text-sm border border-line">
          {t.m}
        </div>
      )}
    </div>
  );
}
