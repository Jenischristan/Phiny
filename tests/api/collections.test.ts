import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/collections/route';

describe('API: /api/collections', () => {
  it('GET /api/collections returns 200 with collections list', async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.count).toBe(json.data.length);
  });

  it('POST /api/collections creates a collection with valid data', async () => {
    const req = new NextRequest('http://localhost:3000/api/collections', {
      method: 'POST',
      body: JSON.stringify({ name: 'Architecture Studies', priv: true, pins: [1, 2] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('Architecture Studies');
    expect(json.data.priv).toBe(true);
    expect(json.data.pins).toEqual([1, 2]);
  });

  it('POST /api/collections returns 400 when name is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/collections', {
      method: 'POST',
      body: JSON.stringify({ name: '   ' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe('Collection name is required');
  });
});
