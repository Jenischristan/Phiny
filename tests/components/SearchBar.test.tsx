import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '@/components/feed/SearchBar';
import { PhinyProvider, useC } from '@/context/PhinyContext';

// Helper to inspect context route inside test
function RouteDisplay() {
  const c = useC();
  return <div data-testid="current-route">{c.route}</div>;
}

describe('Component: SearchBar', () => {
  it('renders search input with accessible placeholder and label', () => {
    const handleSetQ = vi.fn();
    render(
      <PhinyProvider>
        <SearchBar q="" setQ={handleSetQ} />
      </PhinyProvider>
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('placeholder', 'Search pins, creators, themes');
  });

  it('submitting search updates query state', () => {
    const handleSetQ = vi.fn();
    render(
      <PhinyProvider>
        <SearchBar q="" setQ={handleSetQ} />
      </PhinyProvider>
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'typography' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSetQ).toHaveBeenCalledWith('typography');
  });

  it('REGRESSION: Submitting search from another route navigates to home feed', () => {
    function TestHost() {
      const c = useC();
      return (
        <div>
          <button onClick={() => c.nav('settings')} data-testid="go-settings">
            Go to Settings
          </button>
          <SearchBar q={c.q} setQ={c.setQ} />
          <RouteDisplay />
        </div>
      );
    }

    render(
      <PhinyProvider>
        <TestHost />
      </PhinyProvider>
    );

    // Navigate to settings first
    fireEvent.click(screen.getByTestId('go-settings'));
    expect(screen.getByTestId('current-route')).toHaveTextContent('settings');

    // Type in search bar and press Enter
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'concrete' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Should have navigated to home
    expect(screen.getByTestId('current-route')).toHaveTextContent('home');
  });
});
