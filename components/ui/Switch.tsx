'use client';

import React, { useId } from 'react';

interface SwitchProps {
  on: boolean;
  set: (v: boolean) => void;
  label: string;
  hint?: string;
}

export function Switch({ on, set, label, hint }: SwitchProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-line">
      <div>
        <p id={id} className="text-sm font-medium">
          {label}
        </p>
        {hint && <p className="text-xs text-mut">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={id}
        onClick={() => set(!on)}
        className={
          'w-11 h-6 shrink-0 border border-fg transition-colors ' + (on ? 'bg-fg' : 'bg-bg')
        }
      >
        <span
          className={
            'block w-4 h-4 m-[3px] transition-transform ' +
            (on ? 'bg-bg translate-x-5' : 'bg-fg')
          }
        ></span>
      </button>
    </div>
  );
}
