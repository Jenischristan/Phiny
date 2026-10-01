import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AddToDialog } from '@/components/collections/AddToDialog';
import { PhinyProvider, useC } from '@/context/PhinyContext';

function TestHost({ targetId }: { targetId: string | number }) {
  const c = useC();
  return (
    <div>
      <button onClick={() => c.setAddTo(targetId as any)} data-testid="open-add">
        Open Add To
      </button>
      <AddToDialog />
    </div>
  );
}

describe('Component: AddToDialog (ID Normalization)', () => {
  it('REGRESSION: correctly determines if a numeric pin is included in collection with numeric ID', () => {
    render(
      <PhinyProvider>
        <TestHost targetId={1} />
      </PhinyProvider>
    );

    fireEvent.click(screen.getByTestId('open-add'));

    expect(screen.getByRole('dialog', { name: 'Add to collection' })).toBeInTheDocument();
    // Collection c0 has pin 1 initially
    const typeSpecimensBtn = screen.getByRole('button', { name: /Type Specimens/i });
    expect(typeSpecimensBtn).toHaveAttribute('aria-pressed', 'true');
    expect(typeSpecimensBtn).toHaveTextContent('Added');
  });

  it('REGRESSION: correctly determines if a string pin ID ("1") matches numeric pin in collection', () => {
    render(
      <PhinyProvider>
        <TestHost targetId="1" />
      </PhinyProvider>
    );

    fireEvent.click(screen.getByTestId('open-add'));

    const typeSpecimensBtn = screen.getByRole('button', { name: /Type Specimens/i });
    expect(typeSpecimensBtn).toHaveAttribute('aria-pressed', 'true');
    expect(typeSpecimensBtn).toHaveTextContent('Added');
  });

  it('toggling pin in collection updates aria-pressed and label', () => {
    render(
      <PhinyProvider>
        <TestHost targetId={999} />
      </PhinyProvider>
    );

    fireEvent.click(screen.getByTestId('open-add'));

    const typeSpecimensBtn = screen.getByRole('button', { name: /Type Specimens/i });
    expect(typeSpecimensBtn).toHaveAttribute('aria-pressed', 'false');
    expect(typeSpecimensBtn).toHaveTextContent('Add');

    fireEvent.click(typeSpecimensBtn);
    expect(typeSpecimensBtn).toHaveAttribute('aria-pressed', 'true');
    expect(typeSpecimensBtn).toHaveTextContent('Added');
  });
});
