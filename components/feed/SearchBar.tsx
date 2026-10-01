'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useC } from '@/context/PhinyContext';
import { INTERESTS, PEOPLE } from '@/data/mockData';
import { pinSrc } from '@/lib/art';
import { tagsOf } from '@/lib/utils';
import { Person, Post } from '@/types';

const SH: Record<string, string> = { u: 'Creators', p: 'Posts', t: 'Tags' };

type SuggestionRow =
  | { k: 'u'; p: Person }
  | { k: 'p'; p: Post }
  | { k: 't'; g: string }
  | { k: 'a'; l: string };

const SR = (r: SuggestionRow) =>
  r.k === 'u' ? (
    <>
      <ProfileAvatar p={r.p} size={32} />
      <span className="min-w-0">
        <span className="block font-medium truncate">{r.p.name}</span>
        <span className="block text-xs text-mut truncate">
          @{r.p.handle} · {r.p.role}
        </span>
      </span>
    </>
  ) : r.k === 'p' ? (
    <>
      <img
        src={pinSrc(r.p)}
        alt=""
        className="w-8 h-8 object-cover border border-line shrink-0"
      />
      <span className="min-w-0">
        <span className="block font-medium truncate">{r.p.title}</span>
        <span className="block text-xs text-mut truncate">{r.p.by.name}</span>
      </span>
    </>
  ) : r.k === 't' ? (
    <>
      <span className="w-8 h-8 grid place-items-center border border-line shrink-0 text-mut">
        #
      </span>
      <span className="truncate">{r.g}</span>
    </>
  ) : (
    <>
      <Icon n="search" c="w-4 h-4 shrink-0" />
      <span className="truncate">{r.l}</span>
    </>
  );

interface SearchBarProps {
  q: string;
  setQ: (v: string) => void;
}

const FULL_PLACEHOLDER = 'Search pins, creators, themes';

export function SearchBar({ q, setQ }: SearchBarProps) {
  const c = useC();
  const [v, setV] = useState(q);
  const [o, setO] = useState(false);
  const [a, setA] = useState(-1);
  const [ph, setPh] = useState(FULL_PLACEHOLDER);
  const w = useRef<HTMLDivElement | null>(null);
  const k = v.trim().replace(/^#/, '').toLowerCase();

  useEffect(() => {
    setV(q);
  }, [q]);

  useEffect(() => {
    const el = w.current;
    if (!el) return;
    const updatePlaceholder = () => {
      const width = el.clientWidth;
      if (width > 0 && width < 290) {
        const maxChars = Math.max(10, Math.floor((width - 64) / 8));
        setPh(
          maxChars < FULL_PLACEHOLDER.length
            ? FULL_PLACEHOLDER.slice(0, maxChars).trimEnd().replace(/,$/, '') + '...'
            : FULL_PLACEHOLDER
        );
      } else {
        setPh(FULL_PLACEHOLDER);
      }
    };
    updatePlaceholder();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updatePlaceholder);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updatePlaceholder);
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, []);

  useEffect(() => {
    setO(false);
  }, [c.route, c.rid]);

  useEffect(() => {
    if (!o) return;
    const d = (e: PointerEvent) => {
      if (w.current && !w.current.contains(e.target as Node)) setO(false);
    };
    document.addEventListener('pointerdown', d);
    return () => document.removeEventListener('pointerdown', d);
  }, [o]);

  const has = (x: string) => x.toLowerCase().includes(k);

  const rows: SuggestionRow[] = k
    ? [
        ...PEOPLE.filter(
          (p) => p.state !== 'deactivated' && has(p.name + ' ' + p.handle + ' ' + p.role)
        )
          .slice(0, 3)
          .map((p): SuggestionRow => ({ k: 'u', p })),
        ...c.posts
          .filter(
            (p) =>
              p.by.state !== 'deactivated' &&
              !c.hidden[p.id] &&
              p.vis !== 'private' &&
              has(p.title + ' ' + p.by.name + ' ' + tagsOf(p).join(' '))
          )
          .slice(0, 4)
          .map((p): SuggestionRow => ({ k: 'p', p })),
        ...INTERESTS.filter(has)
          .slice(0, 3)
          .map((g): SuggestionRow => ({ k: 't', g })),
        { k: 'a', l: 'See all results for “' + v.trim() + '”' },
      ]
    : [];

  const commit = () => {
    setO(false);
    const trimmed = v.trim();
    setQ(trimmed);
    if (c.route !== 'home' && c.route !== 'explore') {
      c.go('home');
    }
  };

  const pick = (r: SuggestionRow) => {
    setO(false);
    setA(-1);
    if (r.k === 'u') {
      c.go('profile', r.p.id);
      setV(q);
    } else if (r.k === 'p') {
      c.go('post', r.p.id);
      setV(q);
    } else if (r.k === 't') {
      c.setQ('#' + r.g);
      c.go('explore');
    } else {
      commit();
    }
  };

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setO(!!k);
      setA((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setA((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (a >= 0 && rows[a]) pick(rows[a]);
      else commit();
    } else if (e.key === 'Escape' && o) {
      e.preventDefault();
      setO(false);
    }
  };

  return (
    <div
      ref={w}
      onBlur={(e) =>
        !e.currentTarget.contains(e.relatedTarget as Node | null) && setO(false)
      }
      className="relative flex-1 min-w-0"
    >
      <label htmlFor="q" className="sr-only">
        Search Phiny
      </label>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mut pointer-events-none">
        <Icon n="search" />
      </span>
      <input
        id="q"
        type="search"
        role="combobox"
        aria-expanded={o && !!k}
        aria-controls="sq-l"
        aria-autocomplete="list"
        aria-activedescendant={a >= 0 ? 'sq-' + a : undefined}
        autoComplete="off"
        value={v}
        onChange={(e) => {
          const x = e.target.value;
          setV(x);
          setA(-1);
          setO(!!x.trim());
          if (!x && q) setQ('');
        }}
        onFocus={() => k && setO(true)}
        onKeyDown={key}
        placeholder={ph}
        className="inp pl-10 pr-3 truncate placeholder:truncate"
      />
      {o && k && (
        <div
          id="sq-l"
          role="listbox"
          aria-label="Search suggestions"
          className="mpin absolute z-10 left-0 right-0 top-full mt-1 bg-bg border border-line shadow-lg max-h-[70vh] overflow-y-auto ns overscroll-contain max-md:fixed max-md:left-2 max-md:right-2 max-md:top-[calc(4rem+env(safe-area-inset-top,0px))]"
        >
          {rows.length === 1 && (
            <p className="px-4 pt-4 pb-2 text-sm text-mut">
              No matches for “{v.trim()}”.
            </p>
          )}
          {rows.map((r, i) => (
            <React.Fragment key={i}>
              {(i === 0 || r.k !== rows[i - 1].k) && SH[r.k] && (
                <p className="lbl px-4 pt-3 pb-1">{SH[r.k]}</p>
              )}
              <button
                id={'sq-' + i}
                type="button"
                role="option"
                aria-selected={a === i}
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setA(i)}
                onClick={() => pick(r)}
                className={
                  'w-full flex items-center gap-3 px-4 text-sm text-left ' +
                  (r.k === 'a'
                    ? 'h-11 border-t border-line mt-1 text-mut '
                    : 'h-12 ') +
                  (a === i ? 'bg-sub' : '')
                }
              >
                {SR(r)}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
