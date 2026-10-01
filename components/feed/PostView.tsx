'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Grid } from '@/components/feed/Grid';
import { Empty } from '@/components/ui/Empty';
import { FollowButton } from '@/components/ui/FollowButton';
import { Icon } from '@/components/ui/Icon';
import { Menu, shareItems } from '@/components/ui/Menu';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { COMMENTS, PEOPLE } from '@/data/mockData';
import { pinSrc } from '@/lib/art';
import { fmt, MQ, tagsOf } from '@/lib/utils';
import { CommentTuple } from '@/types';

interface PostViewProps {
  id: number | string;
}

export function PostView({ id }: PostViewProps) {
  const router = useRouter();
  const c = useC();
  const p = c.posts.find((x) => String(x.id) === String(id));
  const [cm, setCm] = useState<CommentTuple[]>(COMMENTS);
  const [cl, setCl] = useState<Record<number, boolean>>({});
  const [t, setT] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!p) {
    return <Empty title="POST UNAVAILABLE." text="It may have been removed." />;
  }

  const realId = p.id;
  const rel = c.posts
    .filter(
      (x) =>
        String(x.id) !== String(realId) &&
        x.vis === 'public' &&
        !c.hidden[x.id] &&
        (x.tag === p.tag ||
          tagsOf(x).some((g) => g !== 'Monochrome' && tagsOf(p).includes(g)))
    )
    .slice(0, 8);

  const lk = !!c.liked[realId];
  const sv = !!c.saved[realId];
  const mine = p.by.id === 'me';

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!t.trim()) return;
    c.gate(() => {
      setCm((a) => [...a, [-1, t.trim(), 'Just now']]);
      setT('');
    }, 'Log in to comment.');
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button type="button" onClick={handleBack} className="btn btn-s sm mb-4">
        <Icon n="arrow" c="w-4 h-4 rotate-180" />
        Back
      </button>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
        <div className="border border-line bg-sub p-2 md:p-4 grid place-items-center">
          <img
            src={pinSrc(p)}
            alt={p.alt || p.title + ' by ' + p.by.name}
            className="block"
            style={{
              aspectRatio: '1/' + p.ratio,
              width: 'min(100%,' + 85 / p.ratio + 'vh)',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
        <section
          aria-label="Post details"
          className="border border-line flex flex-col lg:max-h-[85vh]"
        >
          <div className="flex items-center gap-3 p-4 border-b border-line">
            <Link
              href={'/profile/' + p.by.id}
              aria-label={'View ' + p.by.name + ' profile'}
              className="flex items-center gap-3 min-w-0 flex-1 text-left hover:opacity-85 transition-opacity"
            >
              <ProfileAvatar p={p.by} src={p.by.photo} />
              <span className="min-w-0">
                <span className="block font-medium truncate">{p.by.name}</span>
                <span className="block text-xs text-mut truncate">
                  @{p.by.handle}
                </span>
              </span>
            </Link>
            {!mine && (
              <FollowButton
                on={!!c.fol[p.by.id]}
                name={p.by.name}
                onClick={() => c.toggleFol(p.by.id)}
              />
            )}
          </div>
          <div className="flex items-center flex-wrap gap-1 px-3 py-2 border-b border-line">
            <button
              type="button"
              aria-pressed={lk}
              aria-label={lk ? 'Unlike' : 'Like'}
              onClick={() => c.toggleLike(realId)}
              className="h-10 pl-2.5 pr-3 flex items-center gap-2 text-sm border border-transparent hover:bg-sub hover:border-line transition-colors"
            >
              <Icon
                n="heart"
                fill={lk}
                c={'w-5 h-5 ' + (lk ? 'text-coral beat' : '')}
              />
              {p.hideLikes ? '' : fmt(p.likes + (lk ? 1 : 0))}
            </button>
            <Menu
              label="Share"
              ic="share"
              sz="lg"
              title="Share"
              items={shareItems(c, p)}
            />
            <span className="flex-1"></span>
            <button
              type="button"
              onClick={() => c.openAdd(realId)}
              className="btn btn-s sm max-md:hidden"
            >
              <Icon n="folder" />
              Collect
            </button>
            <button
              type="button"
              aria-pressed={sv}
              onClick={() => c.toggleSave(realId)}
              className={'btn sm max-md:hidden ' + (sv ? 'btn-p' : 'btn-s')}
            >
              {sv ? 'Saved' : 'Save'}
            </button>
            <Menu
              label="More actions"
              sz="lg"
              pr={true}
              items={[
                isMobile && [
                  sv ? 'Remove from saved' : 'Save',
                  'bookmark',
                  () => c.toggleSave(realId),
                ],
                isMobile && ['Collect', 'folder', () => c.openAdd(realId)],
                ['Copy link', 'link', () => c.share(p)],
                !mine && [
                  'Show more like this',
                  'plus',
                  () => toast('We’ll show more like this'),
                ],
                !mine && [
                  'Show less like this',
                  'minus',
                  () => {
                    c.hide(realId);
                    c.back();
                  },
                ],
                !mine && ['Report', 'flag', () => c.report('post')],
              ]}
            />
          </div>
          <div
            data-bound="1"
            className="lg:overflow-y-auto ns lg:overscroll-contain p-4 flex-1 min-h-0"
          >
            <h1 className="text-2xl font-bold tracking-tight">{p.title}</h1>
            <p className="text-sm text-mut mt-2">
              {p.desc || 'A study in light, structure and restraint.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {tagsOf(p).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    c.setQ('#' + g);
                    c.go('explore');
                  }}
                  className="lbl border border-line px-2 py-1.5 hover:border-fg hover:text-fg"
                >
                  #{g}
                </button>
              ))}
            </div>
            <p className="lbl mt-4">
              {p.date}
              {p.loc ? ' · ' + p.loc : ''}
            </p>
            <h2 className="text-sm font-bold mt-8 mb-3">
              Comments{p.comments === false ? '' : ' (' + cm.length + ')'}
            </h2>
            {p.comments === false ? (
              <p className="text-sm text-mut">
                Comments are turned off for this post.
              </p>
            ) : (
              <ul className="space-y-4">
                {cm.map(([i, x, w], k) => {
                  const P =
                    i < 0
                      ? c.me || { id: 1, name: 'You', handle: 'you', fers: 0, state: 'active' }
                      : PEOPLE[i];
                  const to = () => i >= 0 && c.go('profile', i);
                  return (
                    <li key={k} className="group flex gap-3">
                      <Link
                        href={'/profile/' + (i < 0 ? 'me' : i)}
                        aria-label={'View ' + P.name + ' profile'}
                        className="shrink-0 self-start"
                      >
                        <ProfileAvatar
                          p={P}
                          size={32}
                          src={i < 0 ? P.photo : undefined}
                        />
                      </Link>
                      <div className="text-sm min-w-0 flex-1">
                        <p>
                          <Link
                            href={'/profile/' + (i < 0 ? 'me' : i)}
                            className="font-bold hover:underline"
                          >
                            {P.name}
                          </Link>{' '}
                          <span className="lbl ml-1">{w}</span>
                        </p>
                        <p className="mt-0.5 break-words">{x}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-mut">
                          <button
                            type="button"
                            aria-pressed={!!cl[k]}
                            aria-label={cl[k] ? 'Unlike comment' : 'Like comment'}
                            onClick={() =>
                              c.gate(
                                () => setCl((z) => ({ ...z, [k]: !z[k] })),
                                'Log in to like comments.'
                              )
                            }
                            className="inline-flex items-center gap-1 hover:text-fg"
                          >
                            <Icon
                              n="heart"
                              fill={!!cl[k]}
                              c={'w-3.5 h-3.5 ' + (cl[k] ? 'text-coral' : '')}
                            />
                            {k * 3 + 2 + (cl[k] ? 1 : 0)}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              c.gate(() => {
                                setT('@' + P.handle + ' ');
                                const e = document.getElementById('cmt');
                                e && e.focus();
                              }, 'Log in to reply.')
                            }
                            className="hover:text-fg"
                          >
                            Reply
                          </button>
                          <Menu
                            sm={true}
                            nw={true}
                            label="Comment options"
                            tcls="-my-2.5 ml-auto md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
                            items={[
                              [
                                'Copy',
                                'copy',
                                () => {
                                  try {
                                    navigator.clipboard.writeText(x);
                                  } catch {
                                    // ignore
                                  }
                                  toast('Comment copied');
                                },
                              ],
                              i < 0
                                ? [
                                    'Delete',
                                    'trash',
                                    () => setCm((a) => a.filter((_, j) => j !== k)),
                                  ]
                                : ['Report', 'flag', () => c.report('comment')],
                            ]}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {p.comments !== false && (
            <form onSubmit={send} className="border-t border-line p-3 flex gap-2">
              <label htmlFor="cmt" className="sr-only">
                Add a comment
              </label>
              <input
                id="cmt"
                value={t}
                readOnly={!c.me}
                onClick={() => !c.me && c.gate(() => {}, 'Log in to comment.')}
                onChange={(e) => setT(e.target.value)}
                placeholder={c.me ? 'Add a comment' : 'Log in to comment'}
                className="inp"
              />
              <button
                type="submit"
                aria-label="Post comment"
                className="btn btn-p px-4"
              >
                <Icon n="send" />
              </button>
            </form>
          )}
        </section>
      </div>
      <section aria-label="Related posts" className="mt-12">
        <h2 className="lbl mb-6">Related posts</h2>
        <Grid list={rel} empty="No related posts yet." />
      </section>
    </div>
  );
}
