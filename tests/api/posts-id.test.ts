import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from '@/app/api/posts/[id]/route';

describe('API: /api/posts/[id]', () => {
  it('GET /api/posts/[id] returns 200 for existing post', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts/0');
    const res = await GET(req, { params: Promise.resolve({ id: '0' }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(String(json.data.id)).toBe('0');
  });

  it('GET /api/posts/[id] returns 404 for nonexistent post', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts/nonexistent_9999');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent_9999' }) });
    expect(res.status).toBe(404);
  });

  it('PATCH /api/posts/[id] updates post attributes', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts/0', {
      method: 'PATCH',
      body: JSON.stringify({ likes: 99 }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: '0' }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.likes).toBe(99);
  });

  it('PATCH /api/posts/[id] returns 404 for nonexistent post', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts/ghost', {
      method: 'PATCH',
      body: JSON.stringify({ likes: 1 }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'ghost' }) });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/posts/[id] deletes post and subsequent GET returns 404', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts/20', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: '20' }) });
    expect(res.status).toBe(200);

    const getReq = new NextRequest('http://localhost:3000/api/posts/20');
    const getRes = await GET(getReq, { params: Promise.resolve({ id: '20' }) });
    expect(getRes.status).toBe(404);
  });

  it('DELETE /api/posts/[id] returns 404 when deleting nonexistent post', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts/ghost_999', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'ghost_999' }) });
    expect(res.status).toBe(404);
  });
});
