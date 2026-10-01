import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Menu } from '@/components/ui/Menu';
import { PhinyProvider } from '@/context/PhinyContext';

describe('Component: Menu', () => {
  it('renders trigger button with accessible label', () => {
    render(
      <PhinyProvider>
        <Menu label="Options menu" items={[['Edit', 'pencil', () => {}]]} />
      </PhinyProvider>
    );
    const trigger = screen.getByRole('button', { name: 'Options menu' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens menu when trigger is clicked and renders menuitems', () => {
    const editFn = vi.fn();
    render(
      <PhinyProvider>
        <Menu
          label="Options menu"
          items={[
            ['Edit', 'pencil', editFn],
            ['Delete', 'trash', () => {}],
          ]}
        />
      </PhinyProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Options menu' });
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu', { name: 'Options menu' });
    expect(menu).toBeInTheDocument();

    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    expect(editItem).toBeInTheDocument();

    fireEvent.click(editItem);
    expect(editFn).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    render(
      <PhinyProvider>
        <Menu label="Options menu" items={[['Item 1', 'link', () => {}]]} />
      </PhinyProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Options menu' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does NOT run a continuous requestAnimationFrame loop while open', () => {
    vi.useFakeTimers();
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(
      <PhinyProvider>
        <Menu label="Options menu" items={[['Item 1', 'link', () => {}]]} />
      </PhinyProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Options menu' });
    fireEvent.click(trigger);

    // Initial count
    const countBefore = rafSpy.mock.calls.length;

    // Advance timers / simulate time passing
    act(() => {
      vi.advanceTimersByTime?.(200);
    });

    const countAfter = rafSpy.mock.calls.length;
    // Must NOT have continuously accumulated animation frames
    expect(countAfter - countBefore).toBeLessThan(3);
    rafSpy.mockRestore();
    vi.useRealTimers();
  });
});
