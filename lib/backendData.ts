import { Collection, Person, Post } from '@/types';
import { COLLS0, PEOPLE, PINS } from '@/data/mockData';

// Shared server-side database store for Next.js API routes
class BackendStore {
  private posts: Post[] = [...PINS];
  private collections: Collection[] = [...COLLS0];
  private users: Person[] = [...PEOPLE];

  getPosts(query?: { tag?: string; q?: string; userId?: string }): Post[] {
    let result = this.posts.filter((p) => p.by.state !== 'deactivated');
    if (query?.tag && query.tag !== 'All') {
      result = result.filter((p) => p.tag.toLowerCase() === query.tag!.toLowerCase());
    }
    if (query?.q) {
      const term = query.q.replace(/^#/, '').toLowerCase();
      result = result.filter((p) =>
        (p.title + ' ' + p.by.name + ' ' + (p.tags?.join(' ') || '')).toLowerCase().includes(term)
      );
    }
    if (query?.userId) {
      result = result.filter((p) => String(p.by.id) === String(query.userId));
    }
    return result;
  }

  getPostById(id: string | number): Post | undefined {
    return this.posts.find((p) => String(p.id) === String(id));
  }

  addPost(post: Post): Post {
    this.posts.unshift(post);
    return post;
  }

  updatePost(id: string | number, updates: Partial<Post>): Post | undefined {
    const idx = this.posts.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return undefined;
    this.posts[idx] = { ...this.posts[idx], ...updates };
    return this.posts[idx];
  }

  deletePost(id: string | number): boolean {
    const initialLen = this.posts.length;
    this.posts = this.posts.filter((p) => String(p.id) !== String(id));
    return this.posts.length < initialLen;
  }

  getCollections(): Collection[] {
    return this.collections;
  }

  getCollectionById(id: string): Collection | undefined {
    return this.collections.find((c) => c.id === id);
  }

  addCollection(collection: Collection): Collection {
    this.collections.push(collection);
    return collection;
  }

  updateCollection(id: string, updates: Partial<Collection>): Collection | undefined {
    const idx = this.collections.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.collections[idx] = { ...this.collections[idx], ...updates };
    return this.collections[idx];
  }

  deleteCollection(id: string): boolean {
    const initialLen = this.collections.length;
    this.collections = this.collections.filter((c) => c.id !== id);
    return this.collections.length < initialLen;
  }

  getUserById(id: string | number): Person | undefined {
    return this.users.find((u) => String(u.id) === String(id));
  }

  addUser(user: Person): Person {
    this.users.push(user);
    return user;
  }

  updateUser(id: string | number, updates: Partial<Person>): Person | undefined {
    const idx = this.users.findIndex((u) => String(u.id) === String(id));
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }
}

// Global singleton across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __phinyBackendStore: BackendStore | undefined;
}

export const backendStore = globalThis.__phinyBackendStore ?? new BackendStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__phinyBackendStore = backendStore;
}
