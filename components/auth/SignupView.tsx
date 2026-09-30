'use client';

import React, { useEffect, useState } from 'react';
import { EyeBtn } from '@/components/ui/EyeBtn';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Logo } from '@/components/ui/Logo';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { UserCard } from '@/components/profile/UserCard';
import { INTERESTS, OPT, PEOPLE, STEPS, TAKEN } from '@/data/mockData';
import { V } from '@/lib/validation';
import { IconName, SignupData } from '@/types';

function SignupProgress({ s }: { s: number }) {
  return (
    <div>
      <p className="lbl mb-3">
        {String(s + 1).padStart(2, '0')} / 09 · {STEPS[s]}
      </p>
      <ol className="flex gap-1" aria-label="Signup progress">
        {STEPS.map((n, i) => (
          <li
            key={n}
            aria-current={i === s ? 'step' : undefined}
            className={
              'h-1 flex-1 transition-colors duration-300 ' + (i <= s ? 'bg-fg' : 'bg-line')
            }
          >
            <span className="sr-only">
              {n}
              {i < s ? ' (done)' : ''}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Sec({
  h,
  sub,
  children,
}: {
  h: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{h}</h1>
      {sub && <p className="text-mut mt-2 mb-8">{sub}</p>}
      {children}
    </div>
  );
}

interface SignupProps {
  onExit: () => void;
  onDone: (d: SignupData) => void;
}

export function SignupView({ onExit, onDone }: SignupProps) {
  const [s, setS] = useState(0);
  const [d, setD] = useState<SignupData>({
    name: '',
    user: '',
    email: '',
    pw: '',
    pw2: '',
    dob: '',
    vis: 'public',
    photo: '',
    ints: [],
    fol: {},
    bio: '',
    web: '',
    loc: '',
    pro: '',
    dis: '',
  });
  const [t, setT] = useState<Record<string, number>>({});
  const [av, setAv] = useState('');
  const [busy, setBusy] = useState(false);
  const [sp, setSp] = useState(false);

  const set = <K extends keyof SignupData>(k: K) => (v: SignupData[K]) =>
    setD((x) => ({ ...x, [k]: v }));
  const bl = (k: string) => () => setT((x) => ({ ...x, [k]: 1 }));

  const E: Record<string, string> = {
    name: V.name(d.name),
    user: V.user(d.user) || (av === 'taken' ? 'That username is taken.' : ''),
    email: V.email(d.email),
    pw: V.pw(d.pw),
    pw2: !d.pw2
      ? 'Confirm your password.'
      : d.pw2 !== d.pw
      ? 'Passwords do not match.'
      : '',
    dob: V.dob(d.dob),
    ints: d.ints.length < 3 ? 'Choose at least 3.' : '',
  };
  const sh = (k: string) => (t[k] ? E[k] : '');

  useEffect(() => {
    if (V.user(d.user)) {
      setAv('');
      return;
    }
    setAv('checking');
    const id = setTimeout(
      () => setAv(TAKEN.includes(d.user.toLowerCase()) ? 'taken' : 'ok'),
      600
    );
    return () => clearTimeout(id);
  }, [d.user]);

  const keys = [
    ['name', 'user', 'email'],
    ['pw', 'pw2'],
    ['dob'],
    [],
    [],
    ['ints'],
    [],
    [],
    [],
  ][s];
  const ok = !keys.some((k) => E[k]) && (s !== 0 || av === 'ok');

  const next = () => {
    if (!ok) {
      setT((x) => keys.reduce((a, k) => ({ ...a, [k]: 1 }), x));
      return;
    }
    if (s < 8) setS(s + 1);
    else {
      setBusy(true);
      setTimeout(() => onDone(d), 900);
    }
  };

  const fol = Object.keys(d.fol).filter((k) => d.fol[k]);
  let body: React.ReactNode;

  if (s === 0) {
    body = (
      <Sec h="Create your identity." sub="This is how people find you on Phiny.">
        <Field
          id="name"
          label="What's your name?"
          value={d.name}
          onChange={set('name')}
          onBlur={bl('name')}
          error={sh('name')}
          autoComplete="name"
        />
        <Field
          id="user"
          label="Choose a username"
          prefix="@"
          value={d.user}
          onChange={(v) => set('user')(v.replace(/\s/g, ''))}
          onBlur={bl('user')}
          error={sh('user')}
          status={V.user(d.user) ? '' : av}
          hint={
            av === 'ok'
              ? 'Username available'
              : av === 'checking'
              ? 'Checking availability…'
              : '3–20 characters: letters, numbers, . and _'
          }
          autoComplete="username"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={d.email}
          onChange={set('email')}
          onBlur={bl('email')}
          error={sh('email')}
          autoComplete="email"
        />
      </Sec>
    );
  } else if (s === 1) {
    body = (
      <Sec
        h="Set a password."
        sub="Use at least 8 characters with a letter and a number."
      >
        <Field
          id="pw"
          label="Password"
          type={sp ? 'text' : 'password'}
          value={d.pw}
          onChange={set('pw')}
          onBlur={bl('pw')}
          error={sh('pw')}
          autoComplete="new-password"
          right={<EyeBtn show={sp} set={setSp} />}
        />
        <PasswordStrength v={d.pw} />
        <Field
          id="pw2"
          label="Confirm password"
          type={sp ? 'text' : 'password'}
          value={d.pw2}
          onChange={set('pw2')}
          onBlur={bl('pw2')}
          error={sh('pw2')}
          status={d.pw2 && d.pw2 === d.pw ? 'ok' : ''}
          autoComplete="new-password"
        />
      </Sec>
    );
  } else if (s === 2) {
    body = (
      <Sec
        h="When were you born?"
        sub="We ask so Phiny stays age-appropriate. It is never shown on your profile."
      >
        <Field
          id="dob"
          label="Date of birth"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={d.dob}
          onChange={set('dob')}
          onBlur={bl('dob')}
          error={sh('dob')}
          autoComplete="bday"
        />
      </Sec>
    );
  } else if (s === 3) {
    const visOpts: ['public' | 'private', string, string, IconName][] = [
      ['public', 'Public', 'Anyone can discover your profile and content.', 'eye'],
      ['private', 'Private', 'Only approved followers can see your content.', 'lock'],
    ];
    body = (
      <Sec h="How do you want your profile to work?">
        <fieldset>
          <legend className="sr-only">Profile visibility</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            {visOpts.map(([k, l, x, i]) => (
              <label key={k} className="cursor-pointer">
                <input
                  type="radio"
                  name="vis"
                  checked={d.vis === k}
                  onChange={() => set('vis')(k)}
                  className="sr-only peer"
                />
                <div className="h-full border border-line p-5 transition-colors peer-checked:border-fg peer-checked:bg-sub peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-navy hover:border-mut">
                  <Icon n={i} c="w-6 h-6 mb-6" />
                  <p className="font-bold text-lg">{l}</p>
                  <p className="text-sm text-mut mt-1">{x}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
      </Sec>
    );
  } else if (s === 4) {
    body = (
      <Sec h="Add a profile image." sub="Optional. You can change it any time.">
        <ImageUploader value={d.photo} onChange={set('photo')} />
      </Sec>
    );
  } else if (s === 5) {
    body = (
      <Sec
        h="What do you want to see?"
        sub={d.ints.length + ' selected · choose at least 3'}
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
          {INTERESTS.map((c) => {
            const on = d.ints.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  set('ints')(on ? d.ints.filter((x) => x !== c) : [...d.ints, c])
                }
                className={'btn ' + (on ? 'btn-p' : 'btn-s')}
              >
                {on && <Icon n="check" />}
                {c}
              </button>
            );
          })}
        </div>
        {t.ints && E.ints && (
          <p role="alert" className="text-xs mt-4">
            <span className="inline-block w-2 h-2 bg-coral mr-2"></span>
            {E.ints}
          </p>
        )}
      </Sec>
    );
  } else if (s === 6) {
    body = (
      <Sec
        h="Find people you might like."
        sub="Follow a few creators to start your feed."
      >
        <div className="space-y-3">
          {PEOPLE.map((p) => (
            <UserCard
              key={p.id}
              p={p}
              on={!!d.fol[p.id]}
              toggle={() => set('fol')({ ...d.fol, [p.id]: !d.fol[p.id] })}
            />
          ))}
        </div>
      </Sec>
    );
  } else if (s === 7) {
    body = (
      <Sec h="Tell us more." sub="Everything here is optional.">
        <div className="mb-6">
          <label
            htmlFor="bio"
            className="text-sm font-medium flex justify-between mb-2"
          >
            Bio
            <span className="lbl">{d.bio.length}/160</span>
          </label>
          <textarea
            id="bio"
            maxLength={160}
            value={d.bio}
            onChange={(e) => set('bio')(e.target.value)}
            className="inp h-24 py-3"
          ></textarea>
        </div>
        <Field
          id="dis"
          label="Creative discipline"
          optional={true}
          value={d.dis}
          onChange={set('dis')}
        />
        <Field
          id="web"
          label="Website"
          type="url"
          optional={true}
          value={d.web}
          onChange={set('web')}
        />
        <Field
          id="pro"
          label="Pronouns"
          optional={true}
          value={d.pro}
          onChange={set('pro')}
        />
      </Sec>
    );
  } else {
    const revItems: [string, string, number][] = [
      ['Identity', d.email, 0],
      ['Visibility', d.vis === 'public' ? 'Public profile' : 'Private profile', 3],
      ['Photo', d.photo ? 'Added' : 'Skipped', 4],
      ['Interests', d.ints.length + ' interests selected', 5],
      ['People', fol.length + ' creators followed', 6],
    ];
    body = (
      <Sec h="Your Phiny profile.">
        <div className="border border-line p-6 flex items-center gap-4 mb-6">
          <ProfileAvatar p={{ id: 1, name: d.name }} size={72} src={d.photo} />
          <div className="min-w-0">
            <p className="text-xl font-bold truncate">{d.name}</p>
            <p className="text-mut">@{d.user}</p>
            <p className="text-sm mt-1">{d.ints.slice(0, 3).join(' · ')}</p>
          </div>
        </div>
        <dl className="border border-line divide-y divide-line">
          {revItems.map(([l, v, i]) => (
            <div key={l} className="flex items-center justify-between p-4">
              <div>
                <dt className="lbl">{l}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
              <button
                type="button"
                onClick={() => setS(i)}
                aria-label={'Edit ' + l}
                className="btn btn-s sm"
              >
                Edit
              </button>
            </div>
          ))}
        </dl>
      </Sec>
    );
  }

  return (
    <div className="h-[100dvh] overflow-hidden md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside
        style={{ backgroundColor: '#0a0a0a' }}
        className="hidden md:flex grain flex-col justify-between gap-6 p-6 lg:p-10 h-full min-h-0 overflow-y-auto ns overflow-x-hidden"
      >
        <div className="shrink-0">
          <Logo />
        </div>
        <div className="my-auto py-4 min-w-0">
          <p className="font-bold text-[clamp(1.85rem,3.5vw,4.25rem)] leading-[1.02] tracking-tight break-words">
            SEE
            <br />
            DIFFERENTLY.
          </p>
          <p className="mt-4 lg:mt-6 text-sm lg:text-base text-white/65 max-w-xs leading-relaxed">
            Set up your identity. It takes about two minutes.
          </p>
        </div>
        <p className="lbl !text-white/50 shrink-0">
          Step {String(s + 1).padStart(2, '0')} of 09
        </p>
      </aside>
      <div className="flex flex-col h-full min-h-0 min-w-0">
        <header className="shrink-0 flex items-center justify-between px-6 md:px-12 pt-6">
          <span className="md:hidden">
            <Logo />
          </span>
          <button
            type="button"
            onClick={onExit}
            className="ml-auto text-sm underline underline-offset-4"
          >
            Exit
          </button>
        </header>
        <div className="shrink-0 px-6 md:px-12 pt-6">
          <SignupProgress s={s} />
        </div>
        <div
          key={s}
          className="flex-1 min-h-0 overflow-y-auto ns overflow-x-hidden overscroll-contain"
        >
          <main className="rise w-full max-w-xl px-6 md:px-12 py-8 min-w-0">
            {body}
          </main>
        </div>
        <footer
          className="shrink-0 bg-bg border-t border-line px-6 md:px-12 py-4 flex items-center gap-3"
          style={{ paddingBottom: 'max(1rem,env(safe-area-inset-bottom,0px))' }}
        >
          <button
            type="button"
            disabled={s === 0}
            onClick={() => setS(s - 1)}
            className="btn btn-s"
          >
            Back
          </button>
          <span className="flex-1"></span>
          {OPT.includes(s) && (
            <button type="button" onClick={() => setS(s + 1)} className="btn btn-s">
              Skip
            </button>
          )}
          <button type="button" disabled={busy} onClick={next} className="btn btn-p">
            {busy && <Icon n="loader" c="w-4 h-4 spin" />}
            {s === 8 ? 'Create my Phiny' : 'Continue'}
          </button>
        </footer>
      </div>
    </div>
  );
}
