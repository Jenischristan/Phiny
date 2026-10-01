import React from 'react';

interface TabsProps {
  tabs: string[];
  v: string;
  set: (t: string) => void;
  label: string;
  right?: React.ReactNode;
}

export function Tabs({ tabs, v, set, label, right }: TabsProps) {
  return (
    <div className="flex items-center justify-between border-b border-line mb-6">
      <div role="tablist" aria-label={label} className="flex gap-6">
        {tabs.map((t) => {
          const selected = v === t;
          const slug = t.toLowerCase().replace(/\s+/g, '-');
          return (
            <button
              key={t}
              id={`tab-${slug}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`tabpanel-${slug}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => set(t)}
              className={
                'h-11 text-sm font-medium border-b-2 -mb-px transition-colors ' +
                (selected ? 'border-fg text-fg' : 'border-transparent text-mut hover:text-fg')
              }
            >
              {t}
            </button>
          );
        })}
      </div>
      {right}
    </div>
  );
}
