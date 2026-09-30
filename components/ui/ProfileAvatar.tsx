import React from 'react';

const AV = ['#413333', '#315B8C', '#F2765E', '#F5EBDD'];

interface ProfileAvatarProps {
  p: { id?: number | string; name?: string };
  size?: number;
  src?: string;
}

export function ProfileAvatar({ p, size = 40, src }: ProfileAvatarProps) {
  const k = typeof p.id === 'number' ? p.id % 4 : 1;
  return (
    <span
      className="shrink-0 grid place-items-center overflow-hidden font-bold border border-line"
      style={{
        width: size,
        height: size,
        background: AV[k],
        color: k > 1 ? '#0a0a0a' : '#fff',
        borderRadius: 2,
        fontSize: size / 2.8,
      }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        (p.name || '?')
          .split(' ')
          .map((x) => x[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      )}
    </span>
  );
}
