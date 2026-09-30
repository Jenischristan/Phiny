'use client';

import React from 'react';
import { SearchBar } from '@/components/feed/SearchBar';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useC } from '@/context/PhinyContext';
import { IB } from '@/lib/utils';
import { IconName, RouteName } from '@/types';

const MOBILE_TOP_ACTIONS: [RouteName, string, IconName][] = [
  ['notifications', 'Notifications', 'bell'],
  ['messages', 'Messages', 'msg'],
];

export function Header() {
  const c = useC();
  const { q, setQ, route: r } = c;

  return (
    <header
      className="sticky z-30 bg-bg border-b border-line flex items-center gap-4 md:gap-6 px-4 md:px-8 h-16"
      style={{ top: 'env(safe-area-inset-top,0px)' }}
    >
      <span className="md:hidden">
        <Logo short={true} />
      </span>
      <SearchBar
        q={q}
        setQ={(x) => {
          setQ(x);
          if (r !== 'home' && r !== 'explore') c.go('home');
        }}
      />
      <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
        {c.me ? (
          <>
            <div className="md:hidden flex items-center gap-1">
              {MOBILE_TOP_ACTIONS.map(([k, l, i]) => (
                <button
                  key={k}
                  type="button"
                  aria-label={l}
                  onClick={() => c.nav(k)}
                  className={IB + ' w-10 h-10 relative'}
                >
                  <Icon n={i} c="w-5 h-5" />
                  {k === 'notifications' && c.unread > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-coral"></span>
                  )}
                </button>
              ))}
              <button
                type="button"
                aria-label="Your profile"
                onClick={() => c.go('profile', 'me')}
              >
                <ProfileAvatar p={c.me} size={40} src={c.me.photo} />
              </button>
            </div>

            <div className="hidden md:flex items-center">
              <button
                type="button"
                aria-label="Your profile"
                onClick={() => c.go('profile', 'me')}
                className="flex items-center gap-2.5 pr-2 hover:opacity-85 transition-opacity text-left"
              >
                <ProfileAvatar p={c.me} size={36} src={c.me.photo} />
                <span className="hidden lg:block max-w-[130px]">
                  <span className="block text-sm font-medium truncate leading-tight">
                    {c.me.name}
                  </span>
                  <span className="block text-xs text-mut truncate leading-tight">
                    @{c.me.handle}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label="Switch accounts"
                aria-haspopup="dialog"
                aria-expanded={c.accOpen}
                onClick={() => c.setAccOpen(true)}
                className={
                  IB +
                  ' w-8 h-8 text-mut hover:text-fg ' +
                  (c.accOpen ? 'bg-sub border-line text-fg' : '')
                }
              >
                <Icon
                  n="chevr"
                  c={
                    'w-4 h-4 transition-transform ' +
                    (c.accOpen ? '-rotate-90' : 'rotate-90')
                  }
                />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={c.openLogin}
              className="btn btn-s sm"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={c.goSignup}
              className="btn btn-p sm hidden sm:inline-flex"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
