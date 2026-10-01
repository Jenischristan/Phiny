import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dialog } from '@/components/ui/Dialog';

describe('Component: Dialog', () => {
  it('renders nothing when open is false', () => {
    render(
      <Dialog open={false} onClose={() => {}} label="Test Dialog">
        <p>Hidden Content</p>
      </Dialog>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog with accessible attributes when open is true', () => {
    const handleClose = vi.fn();
    render(
      <Dialog open={true} onClose={handleClose} label="Test Modal" desc="Modal description text">
        <h2>Modal Body</h2>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog', { name: 'Test Modal' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-describedby');

    const descId = dialog.getAttribute('aria-describedby');
    const descEl = document.getElementById(descId!);
    expect(descEl).toBeInTheDocument();
    expect(descEl).toHaveTextContent('Modal description text');

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    const handleClose = vi.fn();
    render(
      <Dialog open={true} onClose={handleClose} label="Escape Test">
        <p>Press Escape</p>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('REGRESSION: generates UNIQUE aria-describedby IDs when multiple dialogs exist', () => {
    render(
      <div>
        <Dialog open={true} onClose={() => {}} label="Dialog One" desc="Desc One">
          <p>Dialog 1</p>
        </Dialog>
        <Dialog open={true} onClose={() => {}} label="Dialog Two" desc="Desc Two">
          <p>Dialog 2</p>
        </Dialog>
      </div>
    );

    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs.length).toBe(2);

    const descId1 = dialogs[0].getAttribute('aria-describedby');
    const descId2 = dialogs[1].getAttribute('aria-describedby');

    expect(descId1).toBeDefined();
    expect(descId2).toBeDefined();
    expect(descId1).not.toBe(descId2);
    expect(descId1).not.toBe('dlg-d');
    expect(descId2).not.toBe('dlg-d');
  });
});
