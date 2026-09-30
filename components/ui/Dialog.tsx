'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { IB } from '@/lib/utils';

const DS: React.RefObject<HTMLDivElement | null>[] = [];

interface DialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  desc?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
}

export function Dialog({ open, onClose, label, desc, side, children }: DialogProps) {
  const [m, setM] = useState(open);
  const ref = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) {
      setM(true);
      return;
    }
    const id = setTimeout(() => setM(false), 200);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open || !m) return;
    const prev = document.activeElement as HTMLElement | null;
    DS.push(ref);
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && DS[DS.length - 1] === ref) {
        e.stopPropagation();
        onCloseRef.current();
      }
      if (e.key === 'Tab' && ref.current) {
        const f = [
          ...ref.current.querySelectorAll<HTMLElement>(
            'button,input,textarea,select,a[href]'
          ),
        ].filter((x) => !(x as HTMLButtonElement).disabled);
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z?.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a?.focus();
        }
      }
    };
    document.addEventListener('keydown', k);
    const id = setTimeout(() => {
      const t =
        ref.current &&
        (ref.current.querySelector<HTMLElement>('input,textarea') ||
          ref.current.querySelector<HTMLElement>('button'));
      t?.focus();
    }, 60);
    return () => {
      clearTimeout(id);
      const idx = DS.indexOf(ref);
      if (idx !== -1) DS.splice(idx, 1);
      document.removeEventListener('keydown', k);
      setTimeout(() => prev && prev.focus && prev.focus(), 0);
    };
  }, [open, m]);

  if (!m) return null;
  const R = side === 'right';
  const L = side === 'left';
  const S = R || L;

  return (
    <div
      className={
        'fixed inset-0 z-50 bg-black/60 ' +
        (S
          ? R
            ? 'flex justify-end '
            : 'flex justify-start '
          : 'grid place-items-center p-4 ') +
        (open ? 'fadein' : 'fadeout')
      }
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-describedby="dlg-d"
        className={
          'relative bg-bg border-line overflow-auto ns overscroll-contain ' +
          (S
            ? 'h-full w-full sm:w-[380px] p-5 sm:p-6 [padding-top:max(1.25rem,env(safe-area-inset-top))] [padding-bottom:max(1.25rem,env(safe-area-inset-bottom))] ' +
              (R
                ? 'border-l ' + (open ? 'sin' : 'sout')
                : 'border-r ' + (open ? 'lin' : 'lout'))
            : 'w-full max-w-md max-h-[90dvh] border p-5 sm:p-7 ' + (open ? 'popin' : 'popout'))
        }
      >
        <p id="dlg-d" className="sr-only">
          {desc || label}
        </p>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={IB + ' absolute top-2.5 right-2.5 w-10 h-10 text-mut hover:text-fg'}
        >
          <Icon n="x" c="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
