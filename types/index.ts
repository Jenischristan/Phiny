export type AccountState = 'active' | 'private' | 'deactivated';

export interface Person {
  id: number | 'me';
  name: string;
  handle: string;
  role?: string;
  bio?: string;
  fers: number;
  fing?: number;
  loc?: string;
  web?: string;
  state: AccountState;
  vis?: 'public' | 'private';
  photo?: string;
  pro?: string;
  email?: string;
  dis?: string;
}

export interface Post {
  id: number | string;
  title: string;
  by: Person;
  tag: string;
  tags?: string[];
  seed: number;
  ratio: number;
  date: string;
  likes: number;
  vis: 'public' | 'private';
  comments: boolean;
  hideLikes?: boolean;
  src?: string;
  alt?: string;
  desc?: string;
  loc?: string;
}

export interface Collection {
  id: string;
  name: string;
  priv: boolean;
  pins: (number | string)[];
}

export type CommentTuple = [number, string, string];

export interface NotificationItem {
  id: number;
  p: number;
  t: string;
  w: string;
  pin: number | null;
  u: number;
}

export interface ChatMessage {
  id: number;
  me: number | boolean;
  t: string;
  w: string;
  rp?: string | null;
}

export interface Conversation {
  id: number;
  u: number;
  unread?: number | boolean;
  mute: number | boolean;
  m: ChatMessage[];
}

export interface Preferences {
  follow: string;
  msg: string;
  cmt: string;
  men: string;
  saved: boolean;
  likes: number;
  comments: number;
  follows: number;
  mentions: number;
  messages: number;
  recs: number;
  tfa: number;
}

export type SessionTuple = [string, string];

export type ThemeMode = 'light' | 'dark' | 'system';

export type RouteName =
  | 'home'
  | 'explore'
  | 'create'
  | 'library'
  | 'notifications'
  | 'messages'
  | 'profile'
  | 'settings'
  | 'post'
  | 'followers'
  | 'following';

export type SheetType = 'notifications' | 'messages' | null;

export type MenuItemTuple = [string, IconName, () => void] | false | null | undefined | 0 | '';

export interface ConfirmOptions {
  title?: string;
  text?: string;
  cta?: string;
  danger?: number | boolean;
  need?: string;
  ok?: () => void;
}

export interface SignupData {
  name: string;
  user: string;
  email: string;
  pw: string;
  pw2: string;
  dob: string;
  vis: 'public' | 'private';
  photo: string;
  ints: string[];
  fol: Record<string | number, boolean>;
  bio: string;
  web: string;
  loc: string;
  pro: string;
  dis: string;
}

export type IconName =
  | 'home'
  | 'compass'
  | 'search'
  | 'bookmark'
  | 'heart'
  | 'share'
  | 'plus'
  | 'bell'
  | 'mail'
  | 'gear'
  | 'folder'
  | 'eye'
  | 'eyeoff'
  | 'lock'
  | 'check'
  | 'x'
  | 'arrow'
  | 'loader'
  | 'user'
  | 'msg'
  | 'sqplus'
  | 'dots'
  | 'flag'
  | 'link'
  | 'minus'
  | 'pencil'
  | 'trash'
  | 'send'
  | 'copy'
  | 'reply'
  | 'ext'
  | 'panel'
  | 'out'
  | 'chevl'
  | 'chevr'
  | 'chevu'
  | 'clip';
