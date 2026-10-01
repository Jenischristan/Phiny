'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { Menu } from '@/components/ui/Menu';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useC, routeToPath } from '@/context/PhinyContext';
import { NAV } from '@/data/mockData';
import { IB, IBS } from '@/lib/utils';
import { IconName, RouteName } from '@/types';

export function Sidebar() {
  const c = useC();
  const k0 = c.col;
  const row =
    'tip h-11 relative flex items-center gap-3 border text-sm transition-colors overflow-hidden ' +
    (k0 ? 'justify-center' : 'justify-center lg:justify-start lg:px-3');
  const lab = k0 ? 'hidden' : 'hidden lg:inline whitespace-nowrap truncate min-w-0';
  const tg = k0 ? 'Expand sidebar' : 'Collapse sidebar';

  const item = ([k, l, i]: [RouteName, string, IconName]) => {
    const isSheet = k === 'notifications' || k === 'messages';
    const active = c.route === k || c.sheet === k;
    const content = (
      <>
        <Icon n={i} c="w-5 h-5 shrink-0" />
        <span className={lab}>{l}</span>
        {k === 'notifications' && c.unread > 0 && (
          <span
            className="absolute top-2 right-2 w-2 h-2 bg-coral"
            aria-label="Unread notifications"
          ></span>
        )}
      </>
    );
    const cls =
      row +
      ' ' +
      (active
        ? 'border-fg bg-fg text-bg'
        : 'border-transparent hover:border-line');

    if (isSheet) {
      return (
        <button
          key={k}
          type="button"
          aria-label={l}
          data-tip={l}
          aria-current={active ? 'page' : undefined}
          onClick={() => c.nav(k)}
          className={cls}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={k}
        href={routeToPath(k)}
        aria-label={l}
        data-tip={l}
        aria-current={active ? 'page' : undefined}
        className={cls}
      >
        {content}
      </Link>
    );
  };

  return (
    <aside
      className={
        'hidden md:flex flex-col w-[72px] shrink-0 border-r border-line h-screen sticky top-0 z-40 p-3 transition-[width] duration-200 ' +
        (k0 ? '' : 'sb-open lg:w-60 lg:p-5')
      }
    >
      <div
        className={
          'flex mb-4 ' +
          (k0 ? 'flex-col items-center gap-1' : 'items-center justify-between')
        }
      >
        <Link
          href="/"
          aria-label="Phiny home"
          className={
            'h-12 flex items-center ' +
            (k0 ? 'w-full justify-center' : 'flex-1 justify-center lg:justify-start')
          }
        >
          {k0 ? (
            <Logo short={true} />
          ) : (
            <>
              <span className="lg:hidden">
                <Logo short={true} />
              </span>
              <span className="hidden lg:inline">
                <Logo />
              </span>
            </>
          )}
        </Link>
        <button
          type="button"
          aria-expanded={!k0}
          aria-label={tg}
          data-tip={tg}
          onClick={c.toggleCol}
          className={'tip hidden lg:grid ' + IB + ' ' + IBS + ' text-mut hover:text-fg'}
        >
          <Icon n={k0 ? 'chevr' : 'chevl'} c="w-5 h-5" />
        </button>
      </div>
      <nav aria-label="Primary" className="flex flex-col gap-1 flex-1">
        {NAV.slice(0, 6).map(item)}
      </nav>
      <div className="flex flex-col gap-1 border-t border-line pt-3">
        {item(NAV[7])}
        {c.me ? (
          <Menu
            full={true}
            al="start"
            label="Account menu"
            title={'@' + c.me.handle}
            dt="Account"
            tcls={
              'tip w-full h-11 flex items-center gap-3 border text-sm transition-colors ' +
              (k0 ? 'justify-center' : 'justify-center lg:justify-start lg:px-3') +
              ' ' +
              (c.route === 'profile' && c.rid === 'me'
                ? 'border-fg'
                : 'border-transparent hover:border-line')
            }
            kids={
              <>
                <span className="shrink-0">
                  <ProfileAvatar p={c.me} size={24} src={c.me.photo} />
                </span>
                <span className={lab + ' flex-1 text-left'}>{c.me.name}</span>
                <Icon
                  n="chevu"
                  c={'w-4 h-4 ml-auto shrink-0 ' + (k0 ? 'hidden' : 'hidden lg:block')}
                />
              </>
            }
            items={[
              ['Profile', 'user', () => c.go('profile', 'me')],
              ['Settings', 'gear', () => c.go('settings')],
              ['Log out', 'out', c.askLogout],
            ]}
          />
        ) : (
          <button
            type="button"
            aria-label="Log in"
            data-tip="Log in"
            onClick={c.openLogin}
            className={row + ' border-transparent hover:border-line'}
          >
            <Icon n="user" c="w-5 h-5 shrink-0" />
            <span className={lab}>Log in</span>
          </button>
        )}
      </div>
    </aside>
  );
}
