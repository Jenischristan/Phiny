import { NextRequest, NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendData';
import { Post } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag') || undefined;
  const q = searchParams.get('q') || undefined;
  const userId = searchParams.get('userId') || undefined;

  const posts = backendStore.getPosts({ tag, q, userId });
  return NextResponse.json({ success: true, count: posts.length, data: posts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: 'p_' + Date.now(),
      title: body.title.trim(),
      by: body.by || {
        id: 'me',
        name: 'You',
        handle: 'you',
        state: 'active',
        fers: 0,
      },
      tag: body.tag || 'Art',
      tags: body.tags || [body.tag || 'Art'],
      seed: body.seed || Math.floor(Math.random() * 1000),
      ratio: body.ratio || 1,
      date: 'Just now',
      likes: 0,
      vis: body.vis || 'public',
      comments: body.comments !== false,
      hideLikes: !!body.hideLikes,
      src: body.src || undefined,
      alt: body.alt || undefined,
      desc: body.desc || undefined,
      loc: body.loc || undefined,
    };

    backendStore.addPost(newPost);
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
