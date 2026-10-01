import React from 'react';
import Link from 'next/link';
import { FollowButton } from '@/components/ui/FollowButton';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Person } from '@/types';

interface UserCardProps {
  p: Person;
  on: boolean;
  toggle: () => void;
}

export function UserCard({ p, on, toggle }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 border border-line">
      <Link
        href={'/profile/' + p.id}
        aria-label={'View ' + p.name + ' profile'}
        className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity text-left"
      >
        <ProfileAvatar p={p} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{p.name}</p>
          <p className="text-xs text-mut truncate">{p.role || '@' + p.handle}</p>
        </div>
      </Link>
      <FollowButton on={on} name={p.name} onClick={toggle} />
    </div>
  );
}
