'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconBtn } from '@/components/ui/IconBtn';
import { Menu, shareItems, shareNative } from '@/components/ui/Menu';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { pinSrc } from '@/lib/art';
import { MenuItemTuple, Post } from '@/types';

interface ImageCardProps {
  pin: Post;
  extra?: MenuItemTuple[];
}

export function ImageCard({ pin, extra = [] }: ImageCardProps) {
  const c = useC();
  const ref = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const src = pinSrc(pin);
  const [seen, setSeen] = useState(false);
  const [ld, setLd] = useState(() => src.startsWith('data:'));
  const [smScreen, setSmScreen] = useState(false);

  const sv = !!c.saved[pin.id];
  const lk = !!c.liked[pin.id];
  const mine = pin.by.id === 'me';

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLd(true);
    }
    const checkWidth = () => setSmScreen(window.innerWidth < 1024);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          o.disconnect();
        }
      },
      { rootMargin: '0px 0px -30px' }
    );
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={
        'group mb-6 break-inside-avoid transition duration-300 ' +
        (seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')
      }
    >
      <figure>
        <div
          className="relative border border-line overflow-hidden bg-sub"
          style={{ aspectRatio: '1/' + pin.ratio }}
        >
          <Link
            href={'/post/' + pin.id}
            aria-label={'Open ' + pin.title}
            className="block w-full h-full"
          >
            <img
              ref={imgRef}
              src={pinSrc(pin)}
              alt={pin.alt || pin.title + ' by ' + pin.by.name}
              onLoad={() => setLd(true)}
              className={
                'w-full h-full object-cover transition-opacity duration-300 ' +
                (ld ? 'opacity-100' : 'opacity-0')
              }
            />
          </Link>
          <div className="absolute top-3 right-3 max-lg:hidden lg:opacity-0 lg:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              aria-pressed={sv}
              onClick={() => c.toggleSave(pin.id)}
              className={'btn sm ' + (sv ? 'btn-p' : 'bg-bg text-fg')}
            >
              {sv ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        <figcaption className="flex items-start max-md:items-center justify-between pt-3 max-md:pt-1.5 gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate max-md:hidden">{pin.title}</p>
            <Link
              href={'/profile/' + pin.by.id}
              className="block text-xs text-mut hover:text-fg truncate max-w-full text-left"
            >
              {pin.by.name}
            </Link>
          </div>
          <div
            className={
              'flex -mr-2 ml-auto shrink-0 transition-opacity ' +
              (lk
                ? ''
                : 'lg:opacity-0 lg:group-hover:opacity-100 focus-within:opacity-100 has-[[aria-expanded=true]]:opacity-100')
            }
          >
            <IconBtn
              label={(lk ? 'Unlike ' : 'Like ') + pin.title}
              on={lk}
              n="heart"
              onClick={() => c.toggleLike(pin.id)}
            />
            <IconBtn
              label={(sv ? 'Unsave ' : 'Save ') + pin.title}
              on={sv}
              n="bookmark"
              onClick={() => c.toggleSave(pin.id)}
              cls="lg:hidden"
            />
            <Menu
              label={'Share ' + pin.title}
              ic="share"
              tcls="max-lg:hidden"
              title="Share"
              items={shareItems(c, pin)}
            />
            <Menu
              label={'More actions for ' + pin.title}
              items={[
                ...extra,
                smScreen && ['Share', 'share', () => shareNative(c, pin)],
                ['Add to collection', 'folder', () => c.openAdd(pin.id)],
                [sv ? 'Remove from saved' : 'Save', 'bookmark', () => c.toggleSave(pin.id)],
                ['Copy link', 'link', () => c.share(pin)],
                !mine && [
                  'Show more like this',
                  'plus',
                  () => toast('We’ll show more like this'),
                ],
                !mine && ['Show less like this', 'minus', () => c.hide(pin.id)],
                !mine && ['Report', 'flag', () => c.report('post')],
              ]}
            />
          </div>
        </figcaption>
      </figure>
    </article>
  );
}
