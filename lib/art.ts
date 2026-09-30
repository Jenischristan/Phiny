import { Post } from '@/types';

export const PAL = ['#F5EBDD', '#F2765E', '#315B8C', '#413333', '#0a0a0a', '#e5e5e5'];

export const rnd = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;

export const art = (seed: number, w: number, h: number): string => {
  const r = rnd(seed * 97 + 13);
  const p = () => PAL[Math.floor(r() * 6)];
  const bg = p();
  let o = '';
  for (let i = 0, n = 3 + Math.floor(r() * 3); i < n; i++) {
    const c = p();
    const k = r();
    o +=
      k < 0.4
        ? `<circle cx='${r() * w}' cy='${r() * h}' r='${w * (0.1 + r() * 0.35)}' fill='${c}'/>`
        : k < 0.75
        ? `<rect x='${r() * w * 0.6}' y='${r() * h * 0.6}' width='${w * (0.2 + r() * 0.5)}' height='${h * (0.15 + r() * 0.4)}' fill='${c}'/>`
        : `<path d='M0 ${r() * h}Q${w / 2} ${r() * h} ${w} ${r() * h}' stroke='${c}' stroke-width='${8 + r() * 30}' fill='none'/>`;
  }
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${bg}'/>${o}</svg>`
    )
  );
};

export const pinSrc = (p: Post): string =>
  p.src || art(p.seed, 400, Math.round(400 * p.ratio));
