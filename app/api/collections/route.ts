import { NextRequest, NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendData';
import { Collection } from '@/types';

export async function GET() {
  const collections = backendStore.getCollections();
  return NextResponse.json({ success: true, count: collections.length, data: collections });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Collection name is required' },
        { status: 400 }
      );
    }

    const newCollection: Collection = {
      id: 'c_' + Date.now(),
      name: body.name.trim(),
      priv: !!body.priv,
      pins: body.pins || [],
    };

    backendStore.addCollection(newCollection);
    return NextResponse.json({ success: true, data: newCollection }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
