import { describe, it, expect } from 'vitest';
import { tagsOf, clipQ, fmt } from '@/lib/utils';
import { routeToPath, parsePathname } from '@/context/PhinyContext';
import { Post } from '@/types';

describe('General Utilities & URL Mappers', () => {
  describe('tagsOf', () => {
    it('returns custom tags if present on post', () => {
      const post: Post = {
        id: 1,
        title: 'Test',
        by: { id: 0, name: 'Mara', handle: 'mara', fers: 0, state: 'active' },
        tag: 'Art',
        tags: ['Minimalism', 'Typography'],
        seed: 1,
        ratio: 1,
        date: 'Today',
        likes: 0,
        vis: 'public',
        comments: true,
      };
      expect(tagsOf(post)).toEqual(['Minimalism', 'Typography']);
    });

    it('generates fallback tags when tags array is missing', () => {
      const post: Post = {
        id: 0,
        title: 'Test',
        by: { id: 0, name: 'Mara', handle: 'mara', fers: 0, state: 'active' },
        tag: 'Architecture',
        seed: 1,
        ratio: 1,
        date: 'Today',
        likes: 0,
        vis: 'public',
        comments: true,
      };
      const tags = tagsOf(post);
      expect(tags).toContain('Architecture');
      expect(tags).toContain('Monochrome');
      expect(tags.length).toBe(3);
    });
  });

  describe('clipQ', () => {
    it('truncates quoted text longer than limit', () => {
      const longQuote = '“This is a very long quote that needs truncation”';
      const clipped = clipQ(longQuote, 15);
      expect(clipped).toContain('…');
    });

    it('leaves short quotes intact', () => {
      const shortQuote = '“Hello”';
      expect(clipQ(shortQuote, 10)).toBe('“Hello”');
    });
  });

  describe('fmt', () => {
    it('formats numbers under 1000', () => {
      expect(fmt(42)).toBe('42');
      expect(fmt(999)).toBe('999');
    });

    it('formats numbers 1000 to 9999 with locale string', () => {
      expect(fmt(1234)).toBe('1,234');
    });

    it('formats numbers 10000+ with K abbreviation', () => {
      expect(fmt(10000)).toBe('10K');
      expect(fmt(15400)).toBe('15.4K');
    });
  });

  describe('routeToPath', () => {
    it('maps routes correctly', () => {
      expect(routeToPath('home')).toBe('/');
      expect(routeToPath('explore')).toBe('/explore');
      expect(routeToPath('create')).toBe('/create');
      expect(routeToPath('library')).toBe('/library');
      expect(routeToPath('settings')).toBe('/settings');
      expect(routeToPath('post', 5)).toBe('/post/5');
      expect(routeToPath('post', 'n123')).toBe('/post/n123');
      expect(routeToPath('profile', 'me')).toBe('/profile/me');
      expect(routeToPath('profile', 2)).toBe('/profile/2');
      expect(routeToPath('followers', 2)).toBe('/profile/2/followers');
      expect(routeToPath('following', 2)).toBe('/profile/2/following');
    });
  });

  describe('parsePathname', () => {
    it('parses paths to RouteName and rid correctly', () => {
      expect(parsePathname('/')).toEqual({ route: 'home', rid: null, screen: 'app' });
      expect(parsePathname('/explore')).toEqual({ route: 'explore', rid: null, screen: 'app' });
      expect(parsePathname('/create')).toEqual({ route: 'create', rid: null, screen: 'app' });
      expect(parsePathname('/library')).toEqual({ route: 'library', rid: null, screen: 'app' });
      expect(parsePathname('/settings')).toEqual({ route: 'settings', rid: null, screen: 'app' });
      expect(parsePathname('/post/42')).toEqual({ route: 'post', rid: 42, screen: 'app' });
      expect(parsePathname('/post/abc')).toEqual({ route: 'post', rid: 'abc', screen: 'app' });
      expect(parsePathname('/profile/me')).toEqual({ route: 'profile', rid: 'me', screen: 'app' });
      expect(parsePathname('/profile/3')).toEqual({ route: 'profile', rid: 3, screen: 'app' });
      expect(parsePathname('/profile/3/followers')).toEqual({ route: 'followers', rid: 3, screen: 'app' });
      expect(parsePathname('/profile/3/following')).toEqual({ route: 'following', rid: 3, screen: 'app' });
    });
  });
});
