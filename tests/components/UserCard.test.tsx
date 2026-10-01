import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserCard } from '@/components/profile/UserCard';
import { Person } from '@/types';

const mockPerson: Person = {
  id: 7,
  name: 'Marcus Vance',
  handle: 'marcusvance',
  role: 'Industrial Designer',
  fers: 45,
  state: 'active',
};

describe('Component: UserCard', () => {
  it('renders user details and follow button', () => {
    const toggleFn = vi.fn();
    render(<UserCard p={mockPerson} on={false} toggle={toggleFn} />);

    expect(screen.getByText('Marcus Vance')).toBeInTheDocument();
    expect(screen.getByText('Industrial Designer')).toBeInTheDocument();

    const followBtn = screen.getByRole('button', { name: 'Follow Marcus Vance' });
    expect(followBtn).toBeInTheDocument();

    fireEvent.click(followBtn);
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });

  it('REGRESSION: creator card wraps in semantic Link to profile', () => {
    render(<UserCard p={mockPerson} on={false} toggle={() => {}} />);

    const link = screen.getByRole('link', { name: 'View Marcus Vance profile' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile/7');
  });
});
