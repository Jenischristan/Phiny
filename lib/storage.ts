export const LS = {
  get: (k: string, d: string): string => {
    if (typeof window === 'undefined') return d;
    try {
      return window.localStorage.getItem(k) || d;
    } catch {
      return d;
    }
  },
  set: (k: string, v: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(k, v);
    } catch {
      // ignore storage errors
    }
  },
};
