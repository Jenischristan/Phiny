import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from '@/app/api/collections/[id]/route';

describe('API: /api/collections/[id]', () => {
  it('GET /api/collections/[id] returns 200 for existing collection', async () => {
    const req = new NextRequest('http://localhost:3000/api/collections/c0');
    const res = await GET(req, { params: Promise.resolve({ id: 'c0' }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('c0');
  });

  it('GET /api/collections/[id] returns 404 for nonexistent collection', async () => {
    const req = new NextRequest('http://localhost:3000/api/collections/nonexistent_col');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent_col' }) });
    expect(res.status).toBe(404);
  });

  it('PATCH /api/collections/[id] updates collection name and pins', async () => {
    const req = new NextRequest('http://localhost:3000/api/collections/c1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Renamed Moodboard', pins: [0, 1, 2] }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('Renamed Moodboard');
    expect(json.data.pins).toEqual([0, 1, 2]);
  });

  it('DELETE /api/collections/[id] deletes collection and subsequent GET returns 404', async () => {
    const req = new NextRequest('http://localhost:3000/api/collections/c2', { method: 'DELETE' });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'c2' }) });
    expect(res.status).toBe(200);

    const getReq = new NextRequest('http://localhost:3000/api/collections/c2');
    const getRes = await GET(getReq, { params: Promise.resolve({ id: 'c2' }) });
    expect(getRes.status).toBe(404);
  });
});
