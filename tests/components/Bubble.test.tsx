import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Bubble } from '@/components/messages/Bubble';
import { PhinyProvider } from '@/context/PhinyContext';
import { ChatMessage } from '@/types';

const mockMessage: ChatMessage = {
  id: 101,
  me: 1,
  t: 'Testing chat bubble message',
  w: '5m',
};

describe('Component: Bubble', () => {
  it('renders chat message content and timestamp', () => {
    render(
      <PhinyProvider>
        <Bubble m={mockMessage} items={[['Copy', 'copy', () => {}]]} />
      </PhinyProvider>
    );

    expect(screen.getByText('Testing chat bubble message')).toBeInTheDocument();
    expect(screen.getByText('5m')).toBeInTheDocument();
  });

  it('REGRESSION: message menu button is not blocked by pointer-events-none on mobile', () => {
    render(
      <PhinyProvider>
        <Bubble m={mockMessage} items={[['Copy', 'copy', () => {}]]} />
      </PhinyProvider>
    );

    const menuButton = screen.getByRole('button', { name: 'Message options' });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton.className).not.toContain('max-md:pointer-events-none');
  });
});
