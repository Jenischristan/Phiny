'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { useC, PhinyContextValue } from '@/context/PhinyContext';
import { IB, IBS, MQ } from '@/lib/utils';
import { IconName, MenuItemTuple, Post } from '@/types';

const HID: React.CSSProperties = { top: 0, left: 0, visibility: 'hidden' };

export const shareNative = (c: PhinyContextValue, p: Post) =>
  typeof navigator !== 'undefined' && navigator.share
    ? navigator
        .share({ title: p.title, url: window.location.href.split('#')[0] })
        .catch(() => {})
    : c.share(p);

export const shareItems = (c: PhinyContextValue, p: Post): MenuItemTuple[] => {
  const u = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const t = encodeURIComponent(p.title || 'Phiny');
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  return [
    ['Copy link', 'link', () => c.share(p)],
    [
      'Send in a message',
      'msg',
      () => c.gate(() => c.setSheet('messages'), 'Log in to send messages.'),
    ],
    canShare && [
      'Share via device',
      'share',
      () => navigator.share({ title: p.title, url: u }).catch(() => {}),
    ],
    [
      'Share to X',
      'ext',
      () =>
        window.open(
          'https://twitter.com/intent/tweet?url=' + encodeURIComponent(u) + '&text=' + t,
          '_blank',
          'noopener'
        ),
    ],
    [
      'Share to WhatsApp',
      'ext',
      () =>
        window.open(
          'https://wa.me/?text=' + t + '%20' + encodeURIComponent(u),
          '_blank',
          'noopener'
        ),
    ],
    [
      'Share by email',
      'mail',
      () => {
        window.location.href = 'mailto:?subject=' + t + '&body=' + encodeURIComponent(u);
      },
    ],
  ];
};

interface MenuProps {
  label: string;
  items: MenuItemTuple[];
  ic?: IconName;
  tcls?: string;
  title?: string;
  api?: React.MutableRefObject<(() => void) | undefined>;
  sz?: 'lg';
  pr?: boolean;
  full?: boolean;
  kids?: React.ReactNode;
  al?: 'start' | 'end';
  dt?: string;
  nw?: boolean;
  sm?: boolean;
}

export function Menu({
  label,
  items,
  ic = 'dots',
  tcls = '',
  title,
  api,
  sz,
  pr,
  full,
  kids,
  al,
  dt,
  nw,
}: MenuProps) {
  const c = useC();
  const [o, setO] = useState(false);
  const [mt, setMt] = useState(false);
  const [sh, setSh] = useState(false);
  const b = useRef<HTMLButtonElement | null>(null);
  const m = useRef<HTMLDivElement | null>(null);

  const open = () => {
    setSh(typeof window !== 'undefined' && window.matchMedia(MQ).matches);
    setMt(true);
    setO(true);
  };

  const shut = (f?: number | boolean) => {
    setO(false);
    if (f && b.current) b.current.focus({ preventScroll: true });
  };

  const place = () => {
    const t = b.current;
    const e = m.current;
    if (!t || !e || typeof window === 'undefined') return;
    const r = t.getBoundingClientRect();
    const w = e.offsetWidth;
    const h = e.offsetHeight;
    const g = 6;
    const pd = 8;
    const bd = t.closest('[data-bound]');
    const br = bd && bd.getBoundingClientRect();
    const lo = Math.max(pd, br ? br.top : 0);
    const hi = Math.min(window.innerHeight - pd, br ? br.bottom : window.innerHeight);
    let top = r.bottom + g;
    let left = al === 'start' ? r.left : r.right - w;
    if (top + h > hi && r.top - g - h >= lo) top = r.top - g - h;
    top = Math.max(pd, Math.min(top, window.innerHeight - h - pd));
    left = Math.max(pd, Math.min(left, window.innerWidth - w - pd));
    e.style.top = top + 'px';
    e.style.left = left + 'px';
    e.style.visibility = 'visible';
  };

  const key = (e: React.KeyboardEvent) => {
    if (!m.current) return;
    const x = [...m.current.querySelectorAll<HTMLElement>('[role=menuitem]')];
    if (!x.length) return;
    const i = x.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      x[(i + 1) % x.length].focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      x[(i - 1 + x.length) % x.length].focus();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      x[0].focus();
    }
    if (e.key === 'End') {
      e.preventDefault();
      x[x.length - 1].focus();
    }
    if (e.key === 'Tab') shut();
  };

  if (api) api.current = open;

  useLayoutEffect(() => {
    if (mt && !sh) place();
  }, [mt, sh]);

  useEffect(() => {
    if (o) return;
    const id = setTimeout(() => setMt(false), 110);
    return () => clearTimeout(id);
  }, [o]);

  useEffect(() => {
    setO(false);
  }, [c.route, c.rid]);

  useEffect(() => {
    if (!mt || sh) return;
    place();
    const handleReposition = () => place();
    window.addEventListener('resize', handleReposition, { passive: true });
    window.addEventListener('scroll', handleReposition, { passive: true, capture: true });
    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, { capture: true });
    };
  }, [mt, sh]);

  useEffect(() => {
    if (!o || !sh) return;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const preventScroll = (e: Event) => {
      if (m.current && m.current.contains(e.target as Node)) {
        if (m.current.scrollHeight > m.current.clientHeight) return;
      }
      e.preventDefault();
    };
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      const locked = !!document.getElementById('shell')?.inert;
      document.documentElement.style.overflow = locked ? 'hidden' : '';
      document.body.style.overflow = locked ? 'hidden' : '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [o, sh]);

  useEffect(() => {
    if (!o) return;
    const d = (e: PointerEvent) => {
      if (
        m.current &&
        !m.current.contains(e.target as Node) &&
        b.current &&
        !b.current.contains(e.target as Node)
      ) {
        shut();
      }
    };
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        shut(1);
      }
    };
    const io =
      sh || typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([e]) => e.intersectionRatio < 0.25 && shut(),
            { threshold: [0, 0.25, 0.5, 1] }
          );
    if (io && b.current) io.observe(b.current);
    document.addEventListener('pointerdown', d);
    document.addEventListener('keydown', k, true);
    const id = setTimeout(() => {
      const x = m.current && m.current.querySelector<HTMLElement>('[role=menuitem]');
      x && x.focus({ preventScroll: true });
    }, 30);
    return () => {
      clearTimeout(id);
      io && io.disconnect();
      document.removeEventListener('pointerdown', d);
      document.removeEventListener('keydown', k, true);
    };
  }, [o, sh]);

  const hd = sh ? title || label : title;
  const validItems = items.filter(Boolean) as [string, IconName, () => void][];

  return (
    <>
      <button
        ref={b}
        type="button"
        data-tip={dt}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={o}
        onClick={() => (o ? shut() : open())}
        className={
          full
            ? tcls
            : IB +
              ' ' +
              (sz === 'lg' ? 'w-10 h-10' : IBS) +
              (pr ? ' text-fg ' : ' text-fg/70 hover:text-fg ') +
              tcls
        }
      >
        {full ? (
          kids
        ) : (
          <Icon n={ic} c={'w-5 h-5' + (ic === 'dots' ? ' [stroke-width:3.5]' : '')} />
        )}
      </button>
      {mt &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            {sh && (
              <div
                aria-hidden="true"
                className={
                  'fixed inset-0 z-[60] bg-black/40 touch-none ' +
                  (o ? 'fadein' : 'fadeout')
                }
              ></div>
            )}
            <div
              ref={m}
              role="menu"
              aria-label={label}
              onKeyDown={key}
              style={sh ? { paddingBottom: 'env(safe-area-inset-bottom,0px)' } : HID}
              className={
                sh
                  ? 'fixed z-[60] inset-x-0 bottom-0 bg-bg border-t border-line ' +
                    (o ? 'sup' : 'sdn')
                  : 'fixed z-[60] ' +
                    (nw ? 'w-44' : 'w-60') +
                    ' max-w-[calc(100vw-16px)] bg-bg border border-line py-1 shadow-lg ' +
                    (o ? 'mpin' : 'mpout')
              }
            >
              {hd && <p className={'lbl px-4 ' + (sh ? 'py-3' : 'py-2')}>{hd}</p>}
              {validItems.map(([l, i, fn]) => (
                <button
                  key={l}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    shut();
                    b.current?.focus({ preventScroll: true });
                    fn();
                  }}
                  className={
                    'w-full flex items-center gap-3 px-4 text-sm text-left hover:bg-sub focus:bg-sub [outline-offset:-2px] ' +
                    (sh ? 'h-12' : 'h-11')
                  }
                >
                  <Icon n={i} />
                  {l}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
