import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from '@/components/ui/Tabs';

describe('Component: Tabs', () => {
  it('renders tablist and tabs with correct ARIA attributes', () => {
    const handleSet = vi.fn();
    render(
      <Tabs
        tabs={['Saved', 'Created']}
        v="Created"
        set={handleSet}
        label="Profile Tabs"
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Profile Tabs' });
    expect(tablist).toBeInTheDocument();

    const createdTab = screen.getByRole('tab', { name: 'Created' });
    const savedTab = screen.getByRole('tab', { name: 'Saved' });

    expect(createdTab).toHaveAttribute('aria-selected', 'true');
    expect(savedTab).toHaveAttribute('aria-selected', 'false');

    expect(createdTab).toHaveAttribute('aria-controls', 'tabpanel-created');
    expect(savedTab).toHaveAttribute('aria-controls', 'tabpanel-saved');

    fireEvent.click(savedTab);
    expect(handleSet).toHaveBeenCalledWith('Saved');
  });
});
