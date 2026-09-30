import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface CheckProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}

export function Check({ checked, onChange, children }: CheckProps) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer select-none min-h-[44px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        aria-hidden="true"
        className="w-5 h-5 shrink-0 border border-fg grid place-items-center text-bg transition-colors peer-checked:bg-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
      >
        <Icon n="check" c="w-3.5 h-3.5" />
      </span>
      {children}
    </label>
  );
}
