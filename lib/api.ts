import { Collection, Post } from '@/types';

export const api = {
  posts: {
    async list(params?: { tag?: string; q?: string; userId?: string }): Promise<Post[]> {
      try {
        const query = new URLSearchParams();
        if (params?.tag) query.set('tag', params.tag);
        if (params?.q) query.set('q', params.q);
        if (params?.userId) query.set('userId', params.userId);

        const res = await fetch(`/api/posts?${query.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        return data.data;
      } catch (err) {
        console.warn('API error, using client cache:', err);
        return [];
      }
    },

    async create(post: Partial<Post>): Promise<Post | null> {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });
        if (!res.ok) throw new Error('Failed to create post');
        const data = await res.json();
        return data.data;
      } catch (err) {
        console.warn('API error:', err);
        return null;
      }
    },

    async delete(id: string | number): Promise<boolean> {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        return res.ok;
      } catch (err) {
        console.warn('API error:', err);
        return false;
      }
    },
  },

  collections: {
    async list(): Promise<Collection[]> {
      try {
        const res = await fetch('/api/collections');
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data = await res.json();
        return data.data;
      } catch (err) {
        console.warn('API error:', err);
        return [];
      }
    },

    async create(name: string, priv = false, pins: (string | number)[] = []): Promise<Collection | null> {
      try {
        const res = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, priv, pins }),
        });
        if (!res.ok) throw new Error('Failed to create collection');
        const data = await res.json();
        return data.data;
      } catch (err) {
        console.warn('API error:', err);
        return null;
      }
    },

    async update(id: string, updates: Partial<Collection>): Promise<Collection | null> {
      try {
        const res = await fetch(`/api/collections/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update collection');
        const data = await res.json();
        return data.data;
      } catch (err) {
        console.warn('API error:', err);
        return null;
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
        return res.ok;
      } catch (err) {
        console.warn('API error:', err);
        return false;
      }
    },
  },
};
