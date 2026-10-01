import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/login/route';

describe('API: /api/auth/login', () => {
  it('returns 200 with user profile for known handle', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id: 'maraokafor' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.name).toBe('Mara Okafor');
    expect(json.user.handle).toBe('maraokafor');
  });

  it('returns 200 with generated profile for arbitrary new handle/email', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id: 'alex.designer@example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.name).toBe('alex.designer');
    expect(json.user.handle).toBe('alexdesigner');
  });

  it('returns 400 when identifier is empty', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id: '   ' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe('Username or email is required');
  });
});
