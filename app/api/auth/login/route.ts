import { NextRequest, NextResponse } from 'next/server';
import { PEOPLE } from '@/data/mockData';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || !id.trim()) {
      return NextResponse.json(
        { success: false, error: 'Username or email is required' },
        { status: 400 }
      );
    }

    const cleanHandle = id.split('@')[0].replace(/\W/g, '') || 'user';
    const found = PEOPLE.find(
      (p) => p.handle.toLowerCase() === cleanHandle.toLowerCase()
    );

    const user = found || {
      id: 'me',
      name: id.includes('@') ? id.split('@')[0] : id,
      handle: cleanHandle,
      role: 'Creator',
      bio: '',
      vis: 'public',
      fers: 0,
      state: 'active',
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
