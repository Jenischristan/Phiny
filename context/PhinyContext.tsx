'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  COLLS0,
  CONV0,
  NOTES2,
  PF0,
  PINS,
} from '@/data/mockData';
import { LS } from '@/lib/storage';
import { toast } from '@/components/ui/Toaster';
import {
  Collection,
  ConfirmOptions,
  Conversation,
  NotificationItem,
  Person,
  Post,
  Preferences,
  RouteName,
  SheetType,
  SignupData,
  ThemeMode,
} from '@/types';

export function routeToPath(route: RouteName, rid: number | string | null = null): string {
  switch (route) {
    case 'home':
      return '/';
    case 'explore':
      return '/explore';
    case 'create':
      return '/create';
    case 'library':
      return '/library';
    case 'settings':
      return '/settings';
    case 'post':
      return `/post/${rid ?? 0}`;
    case 'profile':
      return rid == null || rid === 'me' ? '/profile/me' : `/profile/${rid}`;
    case 'followers':
      return `/profile/${rid ?? 'me'}/followers`;
    case 'following':
      return `/profile/${rid ?? 'me'}/following`;
    default:
      return '/';
  }
}

export function parsePathname(pathname: string): {
  screen: 'app' | 'signup';
  route: RouteName;
  rid: number | string | null;
} {
  if (pathname === '/signup') {
    return { screen: 'signup', route: 'home', rid: null };
  }
  if (pathname === '/explore') {
    return { screen: 'app', route: 'explore', rid: null };
  }
  if (pathname === '/create') {
    return { screen: 'app', route: 'create', rid: null };
  }
  if (pathname === '/library') {
    return { screen: 'app', route: 'library', rid: null };
  }
  if (pathname === '/settings') {
    return { screen: 'app', route: 'settings', rid: null };
  }
  if (pathname.startsWith('/post/')) {
    const raw = decodeURIComponent(pathname.slice('/post/'.length).split('/')[0]);
    const rid = /^\d+$/.test(raw) ? Number(raw) : raw;
    return { screen: 'app', route: 'post', rid };
  }
  if (pathname === '/profile' || pathname === '/profile/me') {
    return { screen: 'app', route: 'profile', rid: 'me' };
  }
  if (pathname.startsWith('/profile/')) {
    const parts = pathname.slice('/profile/'.length).split('/').filter(Boolean);
    const rawId = decodeURIComponent(parts[0] || 'me');
    const rid = rawId === 'me' ? 'me' : /^\d+$/.test(rawId) ? Number(rawId) : rawId;
    if (parts[1] === 'followers') {
      return { screen: 'app', route: 'followers', rid };
    }
    if (parts[1] === 'following') {
      return { screen: 'app', route: 'following', rid };
    }
    return { screen: 'app', route: 'profile', rid };
  }
  return { screen: 'app', route: 'home', rid: null };
}

export interface PhinyContextValue {
  screen: 'app' | 'signup';
  setScreen: (s: 'app' | 'signup') => void;
  route: RouteName;
  rid: number | string | null;
  go: (route: RouteName, rid?: number | string | null) => void;
  back: () => void;
  me: Person | null;
  user: Partial<Person> | null;
  setUser: React.Dispatch<React.SetStateAction<Partial<Person> | null>>;
  accounts: Partial<Person>[];
  switchAccount: (handle: string) => void;
  accOpen: boolean;
  setAccOpen: React.Dispatch<React.SetStateAction<boolean>>;
  posts: Post[];
  saved: Record<string | number, boolean>;
  liked: Record<string | number, boolean>;
  fol: Record<string | number, boolean>;
  hidden: Record<string | number, number | boolean>;
  colls: Collection[];
  setColls: React.Dispatch<React.SetStateAction<Collection[]>>;
  sheet: SheetType;
  setSheet: React.Dispatch<React.SetStateAction<SheetType>>;
  q: string;
  setQ: React.Dispatch<React.SetStateAction<string>>;
  tag: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  notes: NotificationItem[];
  setNotes: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  convs: Conversation[];
  setConvs: React.Dispatch<React.SetStateAction<Conversation[]>>;
  unread: number;
  col: boolean;
  toggleCol: (x?: boolean | React.MouseEvent) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  pf: Preferences;
  sp: <K extends keyof Preferences>(k: K) => (x: Preferences[K]) => void;
  confirm: (o: ConfirmOptions) => void;
  exit: (msg: string, wipe?: number | boolean) => void;
  askLogout: () => void;
  addTo: number | string | null;
  setAddTo: React.Dispatch<React.SetStateAction<number | string | null>>;
  cd: { coll?: Collection } | null;
  setCd: React.Dispatch<React.SetStateAction<{ coll?: Collection } | null>>;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  nav: (k: RouteName) => void;
  openLogin: () => void;
  goSignup: () => void;
  openAdd: (id: number | string) => void;
  toggleSave: (id: number | string) => void;
  toggleLike: (id: number | string) => void;
  toggleFol: (id: number | string) => void;
  gate: (fn: () => void, w?: string) => void;
  rp: { kind: string } | null;
  setRp: React.Dispatch<React.SetStateAction<{ kind: string } | null>>;
  report: (k: string) => void;
  hide: (id: number | string) => void;
  share: (item?: unknown) => void;
  publish: (pin: Post, cid?: string) => void;
  removeFrom: (cid: string, pid: number | string) => void;
  addToggle: (cid: string, pid: number | string) => void;
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  why: string;
  setWhy: React.Dispatch<React.SetStateAction<string>>;
  cf: ConfirmOptions;
  cfo: boolean;
  setCfo: React.Dispatch<React.SetStateAction<boolean>>;
  lock: boolean;
  onLoginSuccess: (id: string) => void;
  onLoginClose: () => void;
  onLoginSignup: () => void;
  onSignupDone: (d: SignupData) => void;
  onSignupExit: () => void;
}

const Ctx = createContext<PhinyContextValue | null>(null);

export const useC = (): PhinyContextValue => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useC must be used within PhinyProvider');
  }
  return ctx;
};

const DEFAULT_ACCOUNTS: Partial<Person>[] = [
  {
    name: 'Mara Okafor',
    handle: 'maraokafor',
    bio: 'Architectural photographer. Lagos & Zurich.',
    role: 'Architectural photographer',
    vis: 'public',
  },
  {
    name: 'Phiny Studio',
    handle: 'phinystudio',
    bio: 'Curated visual research and monochrome studies.',
    role: 'Design studio',
    vis: 'public',
  },
];

export function PhinyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const parsed = parsePathname(pathname);

  const [prev, setPrev] = useState<{ route: RouteName; rid: number | string | null }[]>([]);
  const [user, setUser] = useState<Partial<Person> | null>(null);
  const [accounts, setAccounts] = useState<Partial<Person>[]>(DEFAULT_ACCOUNTS);
  const [accOpen, setAccOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [sheet, setSheet] = useState<SheetType>(null);
  const [addTo, setAddTo] = useState<number | string | null>(null);
  const [cd, setCd] = useState<{ coll?: Collection } | null>(null);
  const [edit, setEdit] = useState(false);
  const [posts, setPosts] = useState<Post[]>(PINS);
  const [saved, setSaved] = useState<Record<string | number, boolean>>({});
  const [liked, setLiked] = useState<Record<string | number, boolean>>({});
  const [fol, setFol] = useState<Record<string | number, boolean>>({});
  const [hidden, setHidden] = useState<Record<string | number, number | boolean>>({});
  const [colls, setColls] = useState<Collection[]>(COLLS0);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('All');
  const [notes, setNotes] = useState<NotificationItem[]>(NOTES2);
  const [convs, setConvs] = useState<Conversation[]>(CONV0);
  const [col, setCol] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);
  const [pf, setPf] = useState<Preferences>(PF0);
  const [cf, setCf] = useState<ConfirmOptions>({});
  const [cfo, setCfo] = useState(false);
  const [rp, setRp] = useState<{ kind: string } | null>(null);
  const [why, setWhy] = useState('');
  const pend = useRef<(() => void) | null>(null);

  useEffect(() => {
    const savedCol = LS.get('phiny-col', '0') === '1';
    const savedTheme = LS.get('phiny-theme', 'system') as ThemeMode;
    setCol(savedCol);
    setThemeState(
      savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
        ? savedTheme
        : 'system'
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const d = document.documentElement;
    if (theme === 'system') {
      d.removeAttribute('data-theme');
    } else {
      d.setAttribute('data-theme', theme);
    }
    LS.set('phiny-theme', theme);
  }, [theme, hydrated]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    if (typeof document !== 'undefined') {
      const d = document.documentElement;
      if (t === 'system') d.removeAttribute('data-theme');
      else d.setAttribute('data-theme', t);
    }
    LS.set('phiny-theme', t);
  };

  const me: Person | null = user
    ? {
        name: user.name || 'You',
        handle: user.handle || 'you',
        bio: user.bio || '',
        vis: user.vis || 'public',
        photo: user.photo,
        web: user.web,
        loc: user.loc,
        pro: user.pro,
        email: user.email,
        dis: user.dis,
        id: 'me',
        state: 'active',
        fers: 0,
      }
    : null;

  const setScreen = (s: 'app' | 'signup') => {
    if (s === 'signup') {
      router.push('/signup');
    } else {
      router.push('/');
    }
  };

  const go = (route: RouteName, rid: number | string | null = null) => {
    if (
      !user &&
      (route === 'create' ||
        route === 'library' ||
        route === 'settings' ||
        (route === 'profile' && (rid == null || rid === 'me')))
    ) {
      setWhy(route === 'create' ? 'Log in to create posts.' : 'Log in to continue.');
      setLogin(true);
      return;
    }
    setSheet(null);
    setPrev((p) => [...p, { route: parsed.route, rid: parsed.rid }]);
    const targetRid = route === 'profile' && rid == null ? 'me' : rid;
    router.push(routeToPath(route, targetRid));
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const back = () => {
    const p = prev[prev.length - 1] || { route: 'home' as RouteName, rid: null };
    setPrev((x) => x.slice(0, -1));
    router.push(routeToPath(p.route, p.rid));
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const flip = (
    set: React.Dispatch<React.SetStateAction<Record<string | number, boolean>>>,
    id: number | string
  ) => set((s) => ({ ...s, [id]: !s[id] }));

  const gate = (fn: () => void, w?: string) => {
    if (user) {
      fn();
      return;
    }
    pend.current = fn;
    setWhy(w || 'Log in to continue.');
    setLogin(true);
  };

  const confirm = (o: ConfirmOptions) => {
    setCf(o);
    setCfo(true);
  };

  const exit = (msg: string, wipe?: number | boolean) => {
    setUser(null);
    setSheet(null);
    setPrev([]);
    router.push('/');
    if (wipe) setPosts((p) => p.filter((x) => x.by.id !== 'me'));
    toast(msg);
  };

  const toggleCol = (x?: boolean | React.MouseEvent) => {
    const n = typeof x === 'boolean' ? x : !col;
    setCol(n);
    LS.set('phiny-col', n ? '1' : '0');
  };

  const lock =
    login || !!sheet || addTo != null || !!cd || edit || cfo || !!rp || accOpen;

  useEffect(() => {
    const shell = document.getElementById('shell');
    if (shell) {
      shell.inert = lock;
    }
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.style.overflow = lock ? 'hidden' : '';
  }, [lock]);

  const upsertAccount = (acc: Partial<Person>) => {
    setAccounts((prevAccs) => {
      const h = (acc.handle || '').toLowerCase();
      const exists = prevAccs.some((a) => (a.handle || '').toLowerCase() === h);
      if (exists) {
        return prevAccs.map((a) =>
          (a.handle || '').toLowerCase() === h ? { ...a, ...acc } : a
        );
      }
      return [acc, ...prevAccs];
    });
  };

  useEffect(() => {
    if (user && user.handle) {
      upsertAccount(user);
    }
  }, [user]);

  const switchAccount = (handle: string) => {
    const target = accounts.find(
      (a) => (a.handle || '').toLowerCase() === handle.toLowerCase()
    );
    if (!target) return;
    setUser(target);
    toast('Switched to @' + target.handle);
  };

  const onSignupDone = (d: SignupData) => {
    const newAcc: Partial<Person> = {
      name: d.name.trim(),
      handle: d.user,
      email: d.email,
      photo: d.photo,
      bio: d.bio,
      web: d.web,
      loc: d.loc,
      pro: d.pro,
      dis: d.dis,
      vis: d.vis,
    };
    upsertAccount(newAcc);
    setUser(newAcc);
    setFol(d.fol);
    router.push('/');
    toast('Welcome to Phiny, ' + d.name.trim().split(' ')[0] + '.');
  };

  const onSignupExit = () => {
    router.push('/');
  };

  const onLoginClose = () => {
    setLogin(false);
    pend.current = null;
    setWhy('');
  };

  const onLoginSignup = () => {
    setLogin(false);
    pend.current = null;
    setWhy('');
    router.push('/signup');
  };

  const onLoginSuccess = (id: string) => {
    setLogin(false);
    const cleanHandle = id.split('@')[0].replace(/\W/g, '') || 'user';
    const existing = accounts.find(
      (a) => (a.handle || '').toLowerCase() === cleanHandle.toLowerCase()
    );
    const nextUser: Partial<Person> = existing || {
      name: id.includes('@') ? id.split('@')[0] : id,
      handle: cleanHandle,
      bio: '',
      vis: 'public',
    };
    upsertAccount(nextUser);
    setUser(nextUser);
    toast('Signed in as @' + nextUser.handle);
    setWhy('');
    setTimeout(() => {
      const f = pend.current;
      pend.current = null;
      f && f();
    }, 0);
  };

  const ctx: PhinyContextValue = {
    screen: parsed.screen,
    setScreen,
    route: parsed.route,
    rid: parsed.rid,
    go,
    back,
    me,
    user,
    setUser,
    accounts,
    switchAccount,
    accOpen,
    setAccOpen,
    posts,
    saved,
    liked,
    fol,
    hidden,
    colls,
    setColls,
    sheet,
    setSheet,
    q,
    setQ,
    tag,
    setTag,
    notes,
    setNotes,
    convs,
    setConvs,
    unread: notes.filter((n) => n.u).length,
    col,
    toggleCol,
    theme,
    setTheme,
    pf,
    sp: (k) => (x) => setPf((s) => ({ ...s, [k]: x })),
    confirm,
    exit,
    askLogout: () =>
      confirm({
        title: 'Log out of Phiny?',
        text: 'You can sign back in at any time.',
        cta: 'Log out',
        ok: () => exit('Logged out.'),
      }),
    addTo,
    setAddTo,
    cd,
    setCd,
    edit,
    setEdit,
    nav: (k) =>
      k === 'notifications' || k === 'messages'
        ? gate(
            () => setSheet(sheet === k ? null : k),
            'Log in to see your ' + k + '.'
          )
        : go(k),
    openLogin: () => setLogin(true),
    goSignup: () => router.push('/signup'),
    openAdd: (id) => gate(() => setAddTo(id), 'Log in to add to a collection.'),
    toggleSave: (id) =>
      gate(() => {
        flip(setSaved, id);
        toast(saved[id] ? 'Removed from saved' : 'Saved to your library');
      }, 'Log in to save posts.'),
    toggleLike: (id) => gate(() => flip(setLiked, id), 'Log in to like posts.'),
    toggleFol: (id) => gate(() => flip(setFol, id), 'Log in to follow creators.'),
    gate,
    rp,
    setRp,
    report: (k) => setRp({ kind: k }),
    hide: (id) => {
      setHidden((h) => ({ ...h, [id]: 1 }));
      toast('Got it. We’ll show less like this.');
    },
    share: () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
        }
      } catch {
        // ignore clipboard errors
      }
      toast('Link copied');
    },
    publish: (pin, cid) => {
      setPosts((p) => [pin, ...p]);
      if (cid) {
        setColls((cs) =>
          cs.map((k) => (k.id === cid ? { ...k, pins: [pin.id, ...k.pins] } : k))
        );
      }
    },
    removeFrom: (cid, pid) => {
      setColls((cs) =>
        cs.map((k) =>
          k.id === cid ? { ...k, pins: k.pins.filter((x) => x !== pid) } : k
        )
      );
      toast('Removed from collection');
    },
    addToggle: (cid, pid) =>
      setColls((cs) =>
        cs.map((k) =>
          k.id === cid
            ? {
                ...k,
                pins: k.pins.includes(pid)
                  ? k.pins.filter((x) => x !== pid)
                  : [...k.pins, pid],
              }
            : k
        )
      ),
    login,
    setLogin,
    why,
    setWhy,
    cf,
    cfo,
    setCfo,
    lock,
    onLoginSuccess,
    onLoginClose,
    onLoginSignup,
    onSignupDone,
    onSignupExit,
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
