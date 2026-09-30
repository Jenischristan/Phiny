import { INTERESTS } from '@/data/mockData';
import { Post } from '@/types';

export const tagsOf = (p: Post): string[] => {
  const numId = typeof p.id === 'number' ? p.id : 0;
  return p.tags || [p.tag, INTERESTS[(numId * 7 + 3) % 18], 'Monochrome'];
};

export const clipQ = (t: string, n = 25): string =>
  t.replace(/“([^”]*)”/g, (_m, x: string) => '“' + (x.length > n ? x.slice(0, n).trimEnd() + '…' : x) + '”');

export const fmt = (n: number): string =>
  n >= 1e4
    ? (n / 1e3).toFixed(1).replace('.0', '') + 'K'
    : n >= 1e3
    ? n.toLocaleString()
    : String(n);

export const IB =
  'shrink-0 grid place-items-center border border-transparent hover:bg-sub hover:border-line transition-colors';

export const IBS =
  'w-9 h-9 [@media(pointer:coarse)]:w-10 [@media(pointer:coarse)]:h-10';

export const MQ = '(max-width:767px)';
