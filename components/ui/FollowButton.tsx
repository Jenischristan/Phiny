import React from 'react';

interface FollowButtonProps {
  on: boolean;
  onClick: () => void;
  name: string;
}

export function FollowButton({ on, onClick, name }: FollowButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={(on ? 'Unfollow ' : 'Follow ') + name}
      onClick={onClick}
      className={'btn sm ' + (on ? 'btn-p' : 'btn-s')}
    >
      {on ? 'Following' : 'Follow'}
    </button>
  );
}
