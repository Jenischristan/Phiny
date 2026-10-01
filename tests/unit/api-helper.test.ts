import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/lib/api';

describe('Client API Helper (lib/api.ts)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('api.posts', () => {
    it('list fetches /api/posts with encoded query params', async () => {
      const mockPosts = [{ id: 1, title: 'Pin 1' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPosts }),
      });

      const res = await api.posts.list({ tag: 'Art', q: 'photo', userId: '5' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts?tag=Art&q=photo&userId=5')
      );
      expect(res).toEqual(mockPosts);
    });

    it('list returns empty array on network failure', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
      const res = await api.posts.list();
      expect(res).toEqual([]);
    });

    it('create sends POST request with correct payload', async () => {
      const postPayload = { title: 'New Pin', tag: 'Design' };
      const createdPost = { id: 'p_123', ...postPayload };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: createdPost }),
      });

      const res = await api.posts.create(postPayload as any);
      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });
      expect(res).toEqual(createdPost);
    });

    it('delete sends DELETE request', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: true });
      const success = await api.posts.delete('p_123');
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/p_123', { method: 'DELETE' });
      expect(success).toBe(true);
    });
  });

  describe('api.collections', () => {
    it('list fetches /api/collections', async () => {
      const mockColls = [{ id: 'c1', name: 'Board 1' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockColls }),
      });

      const res = await api.collections.list();
      expect(global.fetch).toHaveBeenCalledWith('/api/collections');
      expect(res).toEqual(mockColls);
    });

    it('create sends POST with name, priv, and pins', async () => {
      const mockCreated = { id: 'c_99', name: 'Interiors', priv: true, pins: [1, 2] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCreated }),
      });

      const res = await api.collections.create('Interiors', true, [1, 2]);
      expect(global.fetch).toHaveBeenCalledWith('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Interiors', priv: true, pins: [1, 2] }),
      });
      expect(res).toEqual(mockCreated);
    });

    it('update sends PATCH request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: 'c1', name: 'Renamed' } }),
      });

      const res = await api.collections.update('c1', { name: 'Renamed' });
      expect(global.fetch).toHaveBeenCalledWith('/api/collections/c1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Renamed' }),
      });
      expect(res?.name).toBe('Renamed');
    });

    it('delete sends DELETE request', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: true });
      const success = await api.collections.delete('c1');
      expect(global.fetch).toHaveBeenCalledWith('/api/collections/c1', { method: 'DELETE' });
      expect(success).toBe(true);
    });
  });
});
