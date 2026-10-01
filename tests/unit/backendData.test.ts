import { describe, it, expect, beforeEach } from 'vitest';
import { backendStore } from '@/lib/backendData';
import { Post, Collection } from '@/types';

describe('Server-side Data Layer (backendStore)', () => {
  it('loads initial posts correctly', () => {
    const posts = backendStore.getPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('by');
  });

  it('filters posts by tag', () => {
    const artPosts = backendStore.getPosts({ tag: 'Art' });
    expect(artPosts.every((p) => p.tag.toLowerCase() === 'art')).toBe(true);
  });

  it('filters posts by search query (q)', () => {
    const results = backendStore.getPosts({ q: 'concrete' });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((p) =>
        (p.title + ' ' + p.by.name + ' ' + (p.tags?.join(' ') || ''))
          .toLowerCase()
          .includes('concrete')
      )
    ).toBe(true);
  });

  it('filters posts by userId', () => {
    const user0Posts = backendStore.getPosts({ userId: '0' });
    expect(user0Posts.every((p) => String(p.by.id) === '0')).toBe(true);
  });

  describe('CRUD operations on posts', () => {
    const testPostId = 'test_p_' + Date.now();
    const testPost: Post = {
      id: testPostId,
      title: 'Unit Test Pin',
      by: { id: 'me', name: 'Tester', handle: 'tester', fers: 0, state: 'active' },
      tag: 'Design',
      seed: 99,
      ratio: 1,
      date: 'Just now',
      likes: 0,
      vis: 'public',
      comments: true,
    };

    it('adds a new post', () => {
      backendStore.addPost(testPost);
      const retrieved = backendStore.getPostById(testPostId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('Unit Test Pin');
    });

    it('retrieves post by numeric or string ID', () => {
      // initial post 0
      expect(backendStore.getPostById(0)).toBeDefined();
      expect(backendStore.getPostById('0')).toBeDefined();
    });

    it('updates an existing post', () => {
      const updated = backendStore.updatePost(testPostId, { title: 'Updated Title', likes: 5 });
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.likes).toBe(5);

      const fetched = backendStore.getPostById(testPostId);
      expect(fetched?.title).toBe('Updated Title');
    });

    it('deletes a post', () => {
      const success = backendStore.deletePost(testPostId);
      expect(success).toBe(true);
      expect(backendStore.getPostById(testPostId)).toBeUndefined();
    });

    it('returns false when deleting nonexistent post', () => {
      expect(backendStore.deletePost('nonexistent_id')).toBe(false);
    });
  });

  describe('CRUD operations on collections', () => {
    it('retrieves initial collections', () => {
      const colls = backendStore.getCollections();
      expect(colls.length).toBeGreaterThan(0);
    });

    const testCollId = 'test_c_' + Date.now();
    const testColl: Collection = {
      id: testCollId,
      name: 'Testing Board',
      priv: false,
      pins: [0, '1'],
    };

    it('creates a new collection', () => {
      backendStore.addCollection(testColl);
      const retrieved = backendStore.getCollectionById(testCollId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Testing Board');
    });

    it('updates collection metadata and pins', () => {
      const updated = backendStore.updateCollection(testCollId, {
        name: 'Updated Board',
        pins: [0, '1', 2],
      });
      expect(updated?.name).toBe('Updated Board');
      expect(updated?.pins).toEqual([0, '1', 2]);
    });

    it('deletes a collection', () => {
      const success = backendStore.deleteCollection(testCollId);
      expect(success).toBe(true);
      expect(backendStore.getCollectionById(testCollId)).toBeUndefined();
    });
  });

  describe('Users lookup', () => {
    it('retrieves users by numeric and string ID', () => {
      expect(backendStore.getUserById(0)).toBeDefined();
      expect(backendStore.getUserById('0')).toBeDefined();
      expect(backendStore.getUserById(0)?.name).toBe('Mara Okafor');
    });

    it('returns undefined for non-existent user', () => {
      expect(backendStore.getUserById(99999)).toBeUndefined();
    });
  });
});
