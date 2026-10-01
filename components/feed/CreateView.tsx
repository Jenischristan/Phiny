'use client';

import React, { useState } from 'react';
import { Empty } from '@/components/ui/Empty';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Switch } from '@/components/ui/Switch';
import { toast } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { Post } from '@/types';

interface CreateFormState {
  img: string;
  ratio: number;
  title: string;
  tags: string[];
  tin: string;
  vis: 'public' | 'private';
  hl: boolean;
  cm: boolean;
  loc: string;
  alt: string;
  coll: string;
}

export function CreateView() {
  const c = useC();
  const [f, setF] = useState<CreateFormState>({
    img: '',
    ratio: 1,
    title: '',
    tags: [],
    tin: '',
    vis: 'public',
    hl: false,
    cm: true,
    loc: '',
    alt: '',
    coll: '',
  });
  const [t, setT] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);

  if (!c.me) {
    return (
      <Empty
        title="SIGNED OUT."
        text="Log in to create posts."
        cta="Log in"
        go={c.openLogin}
      />
    );
  }

  const set = <K extends keyof CreateFormState>(k: K) => (v: CreateFormState[K]) =>
    setF((x) => ({ ...x, [k]: v }));

  const setImg = (src: string) => {
    set('img')(src);
    if (src) {
      const im = new Image();
      im.onload = () => set('ratio')(Math.min(2, Math.max(0.5, im.height / im.width)));
      im.src = src;
    }
  };

  const bad = !!f.tin && !/^#?[a-z0-9_]{2,24}$/i.test(f.tin.trim());

  const addTag = () => {
    const v = f.tin.replace(/^#/, '').trim().toLowerCase();
    if (!v) return;
    if (bad || f.tags.length >= 8 || f.tags.includes(v)) {
      setT((x) => ({ ...x, tin: 1 }));
      return;
    }
    setF((x) => ({ ...x, tags: [...x.tags, v], tin: '' }));
  };

  const E: Record<string, string> = {
    img: f.img ? '' : 'Add an image to publish.',
    title:
      f.title.trim().length < 3
        ? 'Give your post a title (3–80 characters).'
        : f.title.length > 80
        ? 'Keep the title under 80 characters.'
        : '',
    tin:
      bad || f.tags.length >= 8
        ? 'Tags use 2–24 letters, numbers or _ , up to 8 in total.'
        : '',
  };
  const sh = (k: string) => (t[k] ? E[k] : '');

  const publish = () => {
    if (E.img || E.title || !c.me) {
      setT({ img: 1, title: 1 });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const pin: Post = {
        id: 'n' + Date.now(),
        title: f.title.trim(),
        by: c.me!,
        tag: f.tags[0] ? f.tags[0].charAt(0).toUpperCase() + f.tags[0].slice(1) : 'Art',
        tags: f.tags.length ? f.tags : undefined,
        seed: 1,
        ratio: f.ratio,
        src: f.img,
        alt: f.alt,
        date: 'Just now',
        likes: 0,
        vis: f.vis,
        comments: f.cm,
        hideLikes: f.hl,
        loc: f.loc,
      };
      c.publish(pin, f.coll);
      toast('Published.');
      c.go('post', pin.id);
    }, 700);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Create</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <ImageUploader
            value={f.img}
            onChange={setImg}
            label="Add post image"
            hint="Drag and drop, or browse (JPG, PNG, WebP up to 5MB)"
            altText="Preview of your post"
          />
          {sh('img') && (
            <p role="alert" className="text-xs mt-2">
              <span className="inline-block w-2 h-2 bg-coral mr-2"></span>
              {E.img}
            </p>
          )}
          <p className="lbl mt-8 mb-3">Post preview</p>
          <div className="border border-line max-w-xs">
            {f.img ? (
              <img
                src={f.img}
                alt="Preview of your post"
                className="w-full block"
                style={{ aspectRatio: '1/' + f.ratio, objectFit: 'cover' }}
              />
            ) : (
              <div className="grain aspect-[4/5]"></div>
            )}
            <div className="p-3">
              <p className="font-medium truncate">{f.title || 'Untitled'}</p>
              <p className="text-xs text-mut">@{c.me.handle}</p>
              <p className="text-xs mt-2 text-mut truncate">
                {f.tags.map((g) => '#' + g).join(' ')}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Field
            id="ct"
            label="Title"
            value={f.title}
            onChange={set('title')}
            onBlur={() => setT((x) => ({ ...x, title: 1 }))}
            error={sh('title')}
            maxLength={80}
          />
          <Field
            id="tg"
            label="Tags"
            value={f.tin}
            onChange={set('tin')}
            error={t.tin ? E.tin : ''}
            hint="Press Enter to add a tag. Up to 8."
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          {f.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 -mt-3 mb-6" aria-label="Added tags">
              {f.tags.map((g) => (
                <li key={g}>
                  <button
                    type="button"
                    aria-label={'Remove tag ' + g}
                    onClick={() => set('tags')(f.tags.filter((x) => x !== g))}
                    className="btn sm btn-s"
                  >
                    #{g}
                    <Icon n="x" c="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <fieldset className="mb-6">
            <legend className="text-sm font-medium mb-2">Visibility</legend>
            <div className="grid grid-cols-2 gap-3">
              {(['public', 'private'] as const).map((k) => (
                <label key={k} className="cursor-pointer">
                  <input
                    type="radio"
                    name="cv"
                    checked={f.vis === k}
                    onChange={() => set('vis')(k)}
                    className="sr-only peer"
                  />
                  <div className="border border-line p-3 capitalize text-sm text-center peer-checked:border-fg peer-checked:bg-sub peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-navy">
                    {k}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
          <Switch
            on={f.hl}
            set={set('hl')}
            label="Hide like count"
            hint="Only you will see the total."
          />
          <Switch on={f.cm} set={set('cm')} label="Allow comments" />
          <div className="mt-6">
            <Field
              id="cl"
              label="Location"
              optional={true}
              value={f.loc}
              onChange={set('loc')}
            />
            <Field
              id="ca"
              label="Alt text"
              optional={true}
              value={f.alt}
              onChange={set('alt')}
              hint="Describe the image for people using screen readers."
            />
            <label htmlFor="cc" className="text-sm font-medium block mb-2">
              Add to collection <span className="lbl float-right">Optional</span>
            </label>
            <select
              id="cc"
              value={f.coll}
              onChange={(e) => set('coll')(e.target.value)}
              className="inp mb-8"
            >
              <option value="">None</option>
              {c.colls.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={publish}
            className="btn btn-p w-full"
          >
            {busy && <Icon n="loader" c="w-4 h-4 spin" />}
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
