import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { IB } from '@/lib/utils';

interface EyeBtnProps {
  show: boolean;
  set: (v: boolean) => void;
}

export function EyeBtn({ show, set }: EyeBtnProps) {
  return (
    <button
      type="button"
      aria-label={show ? 'Hide password' : 'Show password'}
      aria-pressed={show}
      onClick={() => set(!show)}
      className={IB + ' w-8 h-8 text-mut hover:text-fg'}
    >
      <Icon n={show ? 'eyeoff' : 'eye'} />
    </button>
  );
}
