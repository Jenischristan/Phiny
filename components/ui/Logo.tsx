import React from 'react';

interface LogoProps {
  short?: boolean;
}

export function Logo({ short }: LogoProps) {
  return (
    <span className="font-bold tracking-[.3em] text-lg select-none">
      {short ? 'P' : 'PHINY'}
      <span className="inline-block w-1.5 h-1.5 bg-coral ml-1" aria-hidden="true"></span>
    </span>
  );
}
