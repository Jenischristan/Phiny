import React from 'react';
import { strength } from '@/lib/validation';

interface PasswordStrengthProps {
  v: string;
}

export function PasswordStrength({ v }: PasswordStrengthProps) {
  const n = v ? Math.max(strength(v), 1) : 0;
  return (
    <div
      className="mb-6"
      role="img"
      aria-label={
        'Password strength: ' + ['none', 'weak', 'weak', 'fair', 'strong', 'excellent'][n]
      }
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={'h-1 flex-1 transition-colors ' + (i <= n ? 'bg-fg' : 'bg-line')}
          ></span>
        ))}
      </div>
      <p className="lbl mt-2">
        Strength: {['—', 'Weak', 'Weak', 'Fair', 'Strong', 'Excellent'][n]}
      </p>
    </div>
  );
}
