'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CollGrid } from '@/components/collections/CollGrid';
import { CollView } from '@/components/collections/CollView';
import { Grid } from '@/components/feed/Grid';
import { Empty } from '@/components/ui/Empty';
import { FollowButton } from '@/components/ui/FollowButton';
import { Icon } from '@/components/ui/Icon';
import { Menu } from '@/components/ui/Menu';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Tabs } from '@/components/ui/Tabs';
import { useC } from '@/context/PhinyContext';
import { COLL, PEOPLE, SC } from '@/data/mockData';
import { fmt } from '@/lib/utils';

interface ProfileViewProps {
  id: number | string;
}

export function ProfileView({ id }: ProfileViewProps) {
  const c = useC();
  const isMe = id === 'me';
  const numId = typeof id === 'number' ? id : Number(id);
  const p = isMe ? c.me : PEOPLE.find((x) => x.id === numId);
  const [tab, setTab] = useState('Created');
  const [oc, setOc] = useState<string | null>(null);

  if (!p) {
    if (isMe) {
      return (
        <Empty
          title="SIGNED OUT."
          text="Log in to view your profile."
          cta="Log in"
          go={c.openLogin}
        />
      );
    }
    return <Empty title="UNAVAILABLE." text="This profile is currently unavailable." />;
  }

  if (!isMe && p.state === 'deactivated') {
    return (
      <Empty title="UNAVAILABLE." text="This profile is currently unavailable." />
    );
  }

  const on = !!c.fol[p.id];
  const locked = !isMe && p.state === 'private' && !on;
  const posts = c.posts.filter(
    (x) => x.by.id === p.id && (isMe || x.vis === 'public')
  );
  const colls = isMe
    ? c.colls
    : [
        {
          id: 'u' + p.id,
          name: COLL[typeof p.id === 'number' ? p.id % 4 : 0],
          priv: false,
          pins: posts.map((x) => x.id),
        },
      ];
  const coll = [...colls, ...SC].find((k) => k.id === oc);
  const tabs = ['Saved', 'Created'];

  const sec = (l: string, n: number, x: React.ReactNode) => (
    <section className="mb-10">
      <h2 className="lbl mb-4">
        {l} · {n}
      </h2>
      {x}
    </section>
  );

  const savedP = c.posts.filter((x) => c.saved[x.id]);
  const fing = isMe
    ? Object.values(c.fol).filter(Boolean).length
    : p.fing || 0;

  const stat = (n: number, l: string, href?: string) => {
    const i = (
      <>
        <b className="block text-lg">{fmt(n)}</b>
        <span className="lbl">{l}</span>
      </>
    );
    return href ? (
      <Link href={href} className="text-left hover:opacity-75 transition-opacity">
        {i}
      </Link>
    ) : (
      <div>{i}</div>
    );
  };

  const visibleColls = colls.filter((k) => isMe || !k.priv);

  return (
    <div>
      <header className="flex flex-col sm:flex-row gap-5 sm:items-center pb-6 border-b border-line mb-6">
        <ProfileAvatar p={p} size={88} src={p.photo} />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            {p.name}
            {(p.vis === 'private' || p.state === 'private') && <Icon n="lock" />}
          </h1>
          <p className="text-mut">
            @{p.handle}
            {p.pro ? ' · ' + p.pro : ''}
          </p>
          {p.bio && <p className="mt-2 max-w-md">{p.bio}</p>}
          {p.web && (
            <a
              href={'https://' + p.web.replace(/^https?:\/\//, '')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium underline decoration-coral decoration-2 underline-offset-4 hover:opacity-80"
            >
              {p.web.replace(/^https?:\/\//, '')}
              <Icon n="ext" c="w-3.5 h-3.5 text-coral" />
            </a>
          )}
          <div className="flex gap-8 mt-4">
            {stat(posts.length, 'Posts')}
            {stat(
              p.fers + (on ? 1 : 0),
              'Followers',
              isMe ? '/profile/me/followers' : `/profile/${p.id}/followers`
            )}
            {stat(
              fing,
              'Following',
              isMe ? '/profile/me/following' : `/profile/${p.id}/following`
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isMe ? (
            <button
              type="button"
              onClick={() => c.setEdit(true)}
              className="btn btn-s"
            >
              Edit profile
            </button>
          ) : (
            <FollowButton
              on={on}
              name={p.name}
              onClick={() => c.toggleFol(p.id)}
            />
          )}
          <Menu
            label="Profile options"
            items={[
              ['Copy profile link', 'link', () => c.share(p)],
              isMe && ['Settings', 'gear', () => c.go('settings')],
              isMe && ['Log out', 'out', c.askLogout],
              !isMe && ['Report', 'flag', () => c.report('profile')],
            ]}
          />
        </div>
      </header>
      {locked ? (
        <Empty
          title="PRIVATE ACCOUNT."
          text="Follow this account to see their posts and collections."
        />
      ) : coll ? (
        <CollView
          coll={coll}
          mine={isMe && !String(oc).startsWith('sc')}
          onBack={() => setOc(null)}
        />
      ) : (
        <>
          <Tabs
            tabs={tabs}
            v={tab}
            set={setTab}
            label="Profile content"
          />
          {tab === 'Created' ? (
            <>
              {sec(
                'Collections',
                visibleColls.length,
                <CollGrid colls={visibleColls} onOpen={setOc} />
              )}
              {sec(
                'Posts',
                posts.length,
                <Grid
                  list={posts}
                  empty={
                    isMe
                      ? 'Publish your first post from Create.'
                      : 'No public posts yet.'
                  }
                />
              )}
            </>
          ) : !isMe ? (
            <Empty
              title="PRIVATE."
              text="Saved content is only visible to its owner."
            />
          ) : (
            <>
              {sec(
                'Collections',
                SC.length,
                <CollGrid colls={SC} onOpen={setOc} />
              )}
              {sec(
                'Posts',
                savedP.length,
                <Grid
                  list={savedP}
                  empty="Save an image and it will appear here."
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
