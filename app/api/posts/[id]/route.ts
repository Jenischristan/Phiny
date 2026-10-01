import { NextRequest, NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendData';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const post = backendStore.getPostById(id);

  if (!post) {
    return NextResponse.json(
      { success: false, error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: post });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  try {
    const updates = await req.json();
    const updated = backendStore.updatePost(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const deleted = backendStore.deletePost(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: 'Post deleted' });
}
