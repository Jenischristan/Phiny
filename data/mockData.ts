import {
  Collection,
  CommentTuple,
  Conversation,
  IconName,
  NotificationItem,
  Person,
  Post,
  Preferences,
  RouteName,
  SessionTuple,
} from '@/types';

export const INTERESTS = [
  'Art',
  'Photography',
  'Fashion',
  'Architecture',
  'Design',
  'Film',
  'Music',
  'Technology',
  'Travel',
  'Nature',
  'Illustration',
  'Typography',
  'Interior Design',
  'Food',
  'Cars',
  'Sports',
  'Street Photography',
  'Digital Art',
];

const RAW_PEOPLE: [string, string, string][] = [
  ['Mara Okafor', 'maraokafor', 'Architectural photographer'],
  ['Jonas Reiter', 'jreiter', 'Type designer'],
  ['Lin Zhao', 'linzhao', 'Digital artist'],
  ['Sofia Rinaldi', 'sofiarin', 'Interior stylist'],
  ['Theo Marsh', 'theomarsh', 'Street photographer'],
  ['Aiko Tanabe', 'aikot', 'Illustrator'],
  ['Dev Malhotra', 'devmalhotra', 'Industrial designer'],
  ['Elise Moreau', 'elisem', 'Film director'],
];

export const BIOS = [
  'Concrete, light and the space between.',
  'Letterforms, grids and late nights.',
  'Generative worlds in soft focus.',
  'Rooms that feel lived in.',
  'Faces and forgotten corners.',
  'Ink, paper, quiet colour.',
  'Objects made to be held.',
  'Slow films, short frames.',
];

const FERS = [12400, 8320, 45100, 2210, 19800, 760, 5430, 31200];
const FING = [342, 120, 88, 410, 205, 64, 190, 77];
const LOCS = [
  'Chennai, India',
  'Berlin, Germany',
  'Seoul, Korea',
  'Milan, Italy',
  'Lisbon, Portugal',
  'Tokyo, Japan',
  'Mumbai, India',
  'Paris, France',
];

export const PEOPLE: Person[] = RAW_PEOPLE.map(([name, handle, role], i) => ({
  id: i,
  name,
  handle,
  role,
  bio: BIOS[i],
  fers: FERS[i],
  fing: FING[i],
  loc: LOCS[i],
  web: handle + '.com',
  state: i === 5 ? 'private' : i === 7 ? 'deactivated' : 'active',
}));

export const TITLES = [
  'Concrete Light',
  'Study in Vermilion',
  'Quiet Facade',
  'Grid No. 4',
  'Late Editions',
  'Blue Hour Ledger',
  'Paper Architecture',
  'Field Notes',
  'Monolith',
  'Arc and Axis',
  'Noon, Kyoto',
  'Soft Machine',
  'Void Type',
  'Terrace',
  'Ash and Ochre',
  'Signal',
  'Salt Flats',
  'Winter Tailoring',
  'Night Bus',
  'Object 07',
  'Harbour Fog',
  'Red Room',
  'Stairwell',
  'Low Tide',
];

export const RATIOS = [1.25, 0.6, 1.9, 1, 1.4, 0.75, 1.15, 1.6, 0.56, 1, 1.5, 0.85];

export const PINS: Post[] = TITLES.map((title, i) => ({
  id: i,
  title,
  by: PEOPLE[i % 8],
  tag: INTERESTS[(i * 5) % 18],
  seed: i + 3,
  ratio: RATIOS[i % 12],
  date: ((i % 9) + 1) + 'd ago',
  likes: 120 + ((i * 173) % 2400),
  vis: 'public',
  comments: true,
}));

export const COLL = ['Brutalist Moods', 'Type Specimens', 'Warm Palettes', 'Night Walks'];

export const NOTES: [number, string, string][] = [
  [1, 'started following you', '2m'],
  [2, 'saved “Concrete Light”', '1h'],
  [0, 'liked “Grid No. 4”', '3h'],
  [3, 'added you to “Warm Palettes”', '1d'],
];

export const NAV: [RouteName, string, IconName][] = [
  ['home', 'Home', 'home'],
  ['explore', 'Explore', 'compass'],
  ['create', 'Create', 'sqplus'],
  ['library', 'Library', 'bookmark'],
  ['notifications', 'Notifications', 'bell'],
  ['messages', 'Messages', 'msg'],
  ['profile', 'Profile', 'user'],
  ['settings', 'Settings', 'gear'],
];

export const COLLS0: Collection[] = COLL.map((name, i) => ({
  id: 'c' + i,
  name,
  priv: i === 3,
  pins: [i, i + 4, i + 8, i + 12],
}));

export const COMMENTS: CommentTuple[] = [
  [1, 'The negative space here is unreal.', '2h'],
  [3, 'Would love to know the lens.', '5h'],
  [5, 'Saved to Warm Palettes.', '1d'],
  [0, 'Quiet and precise.', '2d'],
];

export const MSGS: [number, string, string, number][] = [
  [3, 'Loved the terrace series. Is it for sale?', '12m', 1],
  [0, 'Thanks for the follow!', '2h', 0],
  [1, 'Sending the type specimen tonight.', '1d', 0],
  [6, 'Shall we collaborate on the shoot?', '2d', 0],
];

const RAW_NOTES2: [number, string, string, number | null, number][] = [
  [1, 'started following you', '2m', null, 1],
  [2, 'liked your post “Concrete Light”', '12m', 0, 1],
  [
    3,
    'commented: “Would love to know the lens and the exact settings you used. The light in the second frame is unreal and I keep staring at it.”',
    '1h',
    2,
    1,
  ],
  [0, 'replied to your comment on “Grid No. 4”', '3h', 3, 0],
  [4, 'mentioned you in “Night Bus”', '5h', 18, 0],
  [5, 'saved your post “Grid No. 4”', '1d', 3, 0],
  [6, 'invited you to collaborate on “Warm Palettes”', '2d', null, 0],
];

export const NOTES2: NotificationItem[] = RAW_NOTES2.map(([p, t, w, pin, u], id) => ({
  id,
  p,
  t,
  w,
  pin,
  u,
}));

export const CONV0: Conversation[] = MSGS.map(([personId, t, w, unread], idx) => ({
  id: idx,
  u: personId,
  unread,
  mute: 0,
  m: [
    { id: 1, me: 1, t: 'Hi! Thanks for the follow.', w: 'Mon' },
    { id: 2, me: 0, t, w },
  ],
}));

export const PF0: Preferences = {
  follow: 'Everyone',
  msg: 'Everyone',
  cmt: 'Everyone',
  men: 'Everyone',
  saved: false,
  likes: 1,
  comments: 1,
  follows: 1,
  mentions: 1,
  messages: 1,
  recs: 0,
  tfa: 0,
};

export const SC: Collection[] = [
  { id: 'sc0', name: 'Type Specimens', priv: false, pins: [1, 5, 9] },
  { id: 'sc1', name: 'Quiet Interiors', priv: false, pins: [3, 7, 11] },
];

export const SESS: SessionTuple[] = [
  ['This device · Chrome', 'Active now'],
  ['iPhone · Safari', '2 days ago'],
  ['MacBook · Firefox', 'Last week'],
];

export const RR = [
  'Spam',
  'Harassment',
  'Hate or abusive content',
  'Nudity or sexual content',
  'Violence',
  'Copyright',
  'Other',
];

export const STEPS = [
  'Identity',
  'Password',
  'Date of birth',
  'Visibility',
  'Photo',
  'Interests',
  'People',
  'About you',
  'Review',
];

export const OPT = [4, 6, 7];

export const TAKEN = ['admin', 'phiny', 'alex', 'support'];

export const SECS = [
  'Account',
  'Privacy',
  'Appearance',
  'Notifications',
  'Security',
  'Danger zone',
];
