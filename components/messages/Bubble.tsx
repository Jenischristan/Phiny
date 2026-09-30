'use client';

import React, { useRef } from 'react';
import { Menu } from '@/components/ui/Menu';
import { ChatMessage, MenuItemTuple } from '@/types';

interface BubbleProps {
  m: ChatMessage;
  items: MenuItemTuple[];
}

export function Bubble({ m, items }: BubbleProps) {
  const api = useRef<(() => void) | undefined>(undefined);
  const tm = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clr = () => {
    if (tm.current) clearTimeout(tm.current);
  };

  return (
    <li className={'group flex ' + (m.me ? 'justify-end' : 'justify-start')}>
      <div className="max-w-[85%]">
        {m.rp && (
          <p className="text-xs text-mut border-l-2 border-line pl-2 mb-1 truncate">
            {m.rp}
          </p>
        )}
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            api.current && api.current();
          }}
          onTouchStart={() => {
            clr();
            tm.current = setTimeout(() => api.current && api.current(), 450);
          }}
          onTouchEnd={clr}
          onTouchMove={clr}
          onTouchCancel={clr}
          className={
            'px-3 py-2 text-sm border break-words [-webkit-touch-callout:none] ' +
            (m.me ? 'bg-fg text-bg border-fg' : 'border-line')
          }
        >
          {m.t}
        </div>
        <div className={'flex items-center h-6 mt-0.5 ' + (m.me ? 'justify-end' : '')}>
          <span className="lbl">{m.w}</span>
          <Menu
            sm={true}
            api={api}
            label="Message options"
            tcls="ml-1 opacity-0 max-md:pointer-events-none md:group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
            items={items}
          />
        </div>
      </div>
    </li>
  );
}
