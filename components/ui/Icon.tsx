import React from 'react';
import { IconName } from '@/types';

export const ICON_PATHS: Record<IconName, string> = {
  home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM16 8l-2 6-6 2 2-6z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  heart: 'M12 20.5s-8.5-5.2-8.5-11A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 2.9c0 5.8-8.5 11-8.5 11z',
  share: 'M12 3v12M7 8l5-5 5 5M5 14v6h14v-6',
  plus: 'M12 5v14M5 12h14',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  gear: 'M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.2a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.2a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.2a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.2a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  folder: 'M3 6h6l2 2h10v11H3z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeoff: 'M3 3l18 18M10 6a9 9 0 0 1 12 6 12 12 0 0 1-3 4M6 7a12 12 0 0 0-4 5s4 7 10 7a9 9 0 0 0 4-1',
  lock: 'M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3',
  check: 'M5 12l5 5 9-10',
  x: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  loader: 'M12 3a9 9 0 1 0 9 9',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0',
  msg: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z',
  sqplus: 'M3 3h18v18H3zM12 8v8M8 12h8',
  dots: 'M12 12h.01M5 12h.01M19 12h.01',
  flag: 'M5 21V4h12l-2 4 2 4H5',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  minus: 'M5 12h14',
  pencil: 'M4 20l1-4L16 5l3 3L8 19z',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  reply: 'M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 6 6v3',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  panel: 'M3 4h18v16H3zM9 4v16',
  out: 'M9 21H4V3h5M16 8l4 4-4 4M20 12H9',
  chevl: 'M15 6l-6 6 6 6',
  chevr: 'M9 6l6 6-6 6',
  chevu: 'M6 15l6-6 6 6',
  clip: 'M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7',
};

interface IconProps {
  n: IconName;
  c?: string;
  fill?: boolean;
}

export function Icon({ n, c = 'w-4 h-4', fill }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={c}
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[n]} />
    </svg>
  );
}
