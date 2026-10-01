import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/posts/route';

describe('API: /api/posts', () => {
  it('GET /api/posts returns 200 with list of posts', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.count).toBe(json.data.length);
  });

  it('GET /api/posts filters by tag', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts?tag=Architecture');
    const res = await GET(req);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.every((p: any) => p.tag.toLowerCase() === 'architecture')).toBe(true);
  });

  it('GET /api/posts filters by search term (q)', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts?q=light');
    const res = await GET(req);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it('POST /api/posts creates a post with valid payload', async () => {
    const body = {
      title: 'Automated Test Pin',
      tag: 'Minimalism',
      ratio: 1.2,
      desc: 'Testing description',
    };
    const req = new NextRequest('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.title).toBe('Automated Test Pin');
    expect(json.data.id).toBeDefined();
  });

  it('POST /api/posts returns 400 when title is missing or blank', async () => {
    const req = new NextRequest('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: '   ' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe('Title is required');
  });
});
