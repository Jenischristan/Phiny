import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { IB, IBS } from '@/lib/utils';
import { IconName } from '@/types';

interface IconBtnProps {
  label: string;
  n: IconName;
  on?: boolean;
  onClick: () => void;
  cls?: string;
}

export function IconBtn({ label, n, on, onClick, cls = '' }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={IB + ' ' + IBS + ' text-fg/70 hover:text-fg ' + cls}
    >
      <Icon n={n} fill={on} c={'w-5 h-5 ' + (on ? 'text-coral beat' : '')} />
    </button>
  );
}
