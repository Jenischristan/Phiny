import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginDialog } from '@/components/auth/LoginDialog';

describe('Component: LoginDialog', () => {
  it('renders sign-in form with username/email and password fields', () => {
    render(
      <LoginDialog
        open={true}
        onClose={() => {}}
        onSignup={() => {}}
        onLogin={() => {}}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Sign in to Phiny' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
  });

  it('validates empty inputs on submit', () => {
    render(
      <LoginDialog
        open={true}
        onClose={() => {}}
        onSignup={() => {}}
        onLogin={() => {}}
      />
    );

    const submitBtn = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Enter your username or email.')).toBeInTheDocument();
    expect(screen.getByText('Enter your password.')).toBeInTheDocument();
  });

  it('calls onLogin callback on valid submission', async () => {
    const handleLogin = vi.fn();
    render(
      <LoginDialog
        open={true}
        onClose={() => {}}
        onSignup={() => {}}
        onLogin={handleLogin}
      />
    );

    fireEvent.change(screen.getByLabelText(/Username or email/i), {
      target: { value: 'maraokafor' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(
      () => {
        expect(handleLogin).toHaveBeenCalledWith('maraokafor');
      },
      { timeout: 1500 }
    );
  });

  it('REGRESSION: switches to interactive forgot-password email form instead of immediate dummy action', () => {
    render(
      <LoginDialog
        open={true}
        onClose={() => {}}
        onSignup={() => {}}
        onLogin={() => {}}
      />
    );

    const forgotBtn = screen.getByRole('button', { name: 'Forgot your password?' });
    fireEvent.click(forgotBtn);

    // Switches to reset password form
    expect(screen.getByRole('dialog', { name: 'Reset password' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
  });

  it('submitting forgot password sends instructions and shows confirmation', async () => {
    render(
      <LoginDialog
        open={true}
        onClose={() => {}}
        onSignup={() => {}}
        onLogin={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Forgot your password?' }));

    const emailInput = screen.getByLabelText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/Check your inbox for a link to reset your password./i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back to sign in' })).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });
});
