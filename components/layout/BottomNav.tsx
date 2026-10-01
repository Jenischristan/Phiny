'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useC, routeToPath } from '@/context/PhinyContext';
import { NAV } from '@/data/mockData';
import { RouteName } from '@/types';

const BOTTOM_KEYS: RouteName[] = ['home', 'explore', 'create', 'library', 'profile'];

export function BottomNav() {
  const c = useC();
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bg border-t border-line grid grid-cols-5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom,0px)' }}
    >
      {BOTTOM_KEYS.map((k) => {
        const found = NAV.find((n) => n[0] === k)!;
        const [, l, i] = found;
        const active = c.route === k;
        return (
          <Link
            key={k}
            href={routeToPath(k)}
            aria-label={l}
            aria-current={active ? 'page' : undefined}
            className={
              'h-14 grid place-items-center border-t-2 ' +
              (active
                ? 'text-fg border-fg'
                : 'text-mut border-transparent')
            }
          >
            <Icon n={i} c="w-6 h-6" />
          </Link>
        );
      })}
    </nav>
  );
}
