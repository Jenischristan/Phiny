import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PhinyProvider, useC } from '@/context/PhinyContext';
import { MsgsSheet } from '@/components/messages/MsgsSheet';
import { HomeView } from '@/components/feed/HomeView';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CollectionDetailView } from '@/components/collections/CollectionDetailView';

// Helper for testing context mutations
function ContextMutator({ onMount }: { onMount: (c: ReturnType<typeof useC>) => void }) {
  const c = useC();
  React.useEffect(() => {
    onMount(c);
  }, [c, onMount]);
  return null;
}

describe('Audit Regression Test Suite', () => {
  it('REGRESSION: MsgsSheet maps conversation 0 to Sofia Rinaldi (u=3), NOT Mara Okafor (id=0)', () => {
    function Host() {
      const c = useC();
      return (
        <div>
          <button onClick={() => c.setSheet('messages')} data-testid="open-messages">
            Open
          </button>
          <MsgsSheet />
        </div>
      );
    }

    render(
      <PhinyProvider>
        <Host />
      </PhinyProvider>
    );

    fireEvent.click(screen.getByTestId('open-messages'));

    // Conversation 0 in MSGS has participant u=3 (Sofia Rinaldi)
    const sofiaThread = screen.getByText(/Sofia Rinaldi/i);
    expect(sofiaThread).toBeInTheDocument();
  });

  it('REGRESSION: HomeView does not filter pins by Explore tag', () => {
    function Host() {
      const c = useC();
      return (
        <div>
          <button
            onClick={() => c.setTag('Architecture')}
            data-testid="set-explore-tag"
          >
            Set Explore Tag
          </button>
          <HomeView />
        </div>
      );
    }

    render(
      <PhinyProvider>
        <Host />
      </PhinyProvider>
    );

    // Initial pins present
    const initialCards = screen.getAllByRole('article');
    const initialCount = initialCards.length;
    expect(initialCount).toBeGreaterThan(0);

    // Set tag to 'Architecture' (simulating user selecting a tag on Explore page)
    fireEvent.click(screen.getByTestId('set-explore-tag'));

    // Home feed pins must NOT be filtered down to only Architecture pins
    const afterCards = screen.getAllByRole('article');
    expect(afterCards.length).toBe(initialCount);
  });

  it('REGRESSION: Sidebar and BottomNav navigation items use semantic HTML anchor links (<a>)', () => {
    render(
      <PhinyProvider>
        <div>
          <Sidebar />
          <BottomNav />
        </div>
      </PhinyProvider>
    );

    // Home, Explore, Create, Library should be <a> elements with appropriate hrefs
    const homeLinks = screen.getAllByRole('link', { name: /Home/i });
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(homeLinks[0]).toHaveAttribute('href', '/');

    const exploreLinks = screen.getAllByRole('link', { name: /Explore/i });
    expect(exploreLinks.length).toBeGreaterThan(0);
    expect(exploreLinks[0]).toHaveAttribute('href', '/explore');

    const libraryLinks = screen.getAllByRole('link', { name: /Library/i });
    expect(libraryLinks.length).toBeGreaterThan(0);
    expect(libraryLinks[0]).toHaveAttribute('href', '/library');
  });

  it('REGRESSION: CollectionDetailView renders valid collections by ID and handles invalid IDs', () => {
    // Valid collection c0
    const { unmount } = render(
      <PhinyProvider>
        <CollectionDetailView id="c0" />
      </PhinyProvider>
    );

    expect(screen.getByText('Type Specimens')).toBeInTheDocument();
    unmount();

    // Invalid collection
    render(
      <PhinyProvider>
        <CollectionDetailView id="nonexistent_collection" />
      </PhinyProvider>
    );

    expect(screen.getByText('COLLECTION UNAVAILABLE.')).toBeInTheDocument();
  });
});
