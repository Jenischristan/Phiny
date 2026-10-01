'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useC } from '@/context/PhinyContext';
import { pinSrc } from '@/lib/art';
import { Collection } from '@/types';

interface CollGridProps {
  colls: Collection[];
  onOpen?: (id: string) => void;
}

export function CollGrid({ colls, onOpen }: CollGridProps) {
  const c = useC();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {colls.map((k) => {
        const p = c.posts.find((x) => String(x.id) === String(k.pins[0]));
        return (
          <Link
            key={k.id}
            href={'/collection/' + k.id}
            onClick={() => onOpen && onOpen(k.id)}
            className="text-left border border-line hover:border-fg transition-colors block"
          >
            <div className="aspect-[4/3] bg-sub overflow-hidden">
              {p ? (
                <img
                  src={pinSrc(p)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="grain w-full h-full"></div>
              )}
            </div>
            <div className="p-3 flex justify-between gap-2">
              <span className="min-w-0">
                <span className="block font-medium truncate">{k.name}</span>
                <span className="text-xs text-mut">{k.pins.length} posts</span>
              </span>
              {k.priv && <Icon n="lock" />}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
