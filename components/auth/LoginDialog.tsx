'use client';

import React, { useState } from 'react';
import { Check } from '@/components/ui/Check';
import { Dialog } from '@/components/ui/Dialog';
import { EyeBtn } from '@/components/ui/EyeBtn';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { toast } from '@/components/ui/Toaster';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSignup: () => void;
  onLogin: (id: string) => void;
  why?: string;
}

export function LoginDialog({
  open,
  onClose,
  onSignup,
  onLogin,
  why,
}: LoginDialogProps) {
  const [v, setV] = useState({ id: '', pw: '', keep: true });
  const [t, setT] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const E: Record<string, string> = {
    id: v.id.trim() ? '' : 'Enter your username or email.',
    pw: v.pw ? '' : 'Enter your password.',
    forgotEmail: forgotEmail.trim() ? '' : 'Enter your email address.',
  };
  const sh = (k: string) => (t[k] ? E[k] : '');

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setT((x) => ({ ...x, forgotEmail: 1 }));
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setForgotSent(true);
      toast('Reset instructions sent to your email.');
    }, 600);
  };

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (E.id || E.pw) {
      setT({ id: 1, pw: 1 });
      return;
    }
    setBusy(true);
    const enteredId = v.id;
    setTimeout(() => {
      setBusy(false);
      setV({ id: '', pw: '', keep: true });
      setT({});
      onLogin(enteredId);
    }, 700);
  };

  const handleClose = () => {
    setForgot(false);
    setForgotSent(false);
    setForgotEmail('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      label={forgot ? 'Reset password' : 'Sign in to Phiny'}
      desc={forgot ? 'Reset your Phiny account password.' : 'Enter your username or email and password to sign in.'}
    >
      {forgot ? (
        <form onSubmit={handleForgotSubmit} noValidate>
          <div className="text-center mb-6">
            <Logo />
            <h2 className="text-2xl font-bold mt-4">Reset password</h2>
            <p className="text-sm text-mut mt-2">
              {forgotSent
                ? 'Check your inbox for a link to reset your password.'
                : 'Enter your email address and we will send you a reset link.'}
            </p>
          </div>
          {!forgotSent ? (
            <>
              <Field
                id="f-email"
                label="Email address"
                type="email"
                value={forgotEmail}
                onChange={setForgotEmail}
                error={sh('forgotEmail')}
                autoComplete="email"
              />
              <button type="submit" disabled={busy} className="btn btn-p w-full">
                {busy ? <Icon n="loader" c="w-4 h-4 spin" /> : null}
                {busy ? 'Sending link...' : 'Send reset link'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setForgot(false);
                setForgotSent(false);
              }}
              className="btn btn-p w-full"
            >
              Back to sign in
            </button>
          )}
          <div className="text-center text-sm mt-4">
            <button
              type="button"
              onClick={() => {
                setForgot(false);
                setForgotSent(false);
              }}
              className="underline underline-offset-4 text-xs text-mut hover:text-fg"
            >
              Cancel and return to sign in
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={go} noValidate>
          <div className="text-center mb-8">
            <Logo />
            <h2 className="text-2xl font-bold mt-6">Welcome back.</h2>
            {why && <p className="text-sm text-mut mt-2">{why}</p>}
          </div>
          <Field
            id="l-id"
            label="Username or email"
            value={v.id}
            onChange={(x) => setV({ ...v, id: x })}
            onBlur={() => setT({ ...t, id: 1 })}
            error={sh('id')}
            autoComplete="username"
          />
          <Field
            id="l-pw"
            label="Password"
            type={show ? 'text' : 'password'}
            value={v.pw}
            onChange={(x) => setV({ ...v, pw: x })}
            onBlur={() => setT({ ...t, pw: 1 })}
            error={sh('pw')}
            autoComplete="current-password"
            right={<EyeBtn show={show} set={setShow} />}
          />
          <div className="mb-6">
            <Check checked={v.keep} onChange={(x) => setV({ ...v, keep: x })}>
              Keep me signed in
            </Check>
          </div>
          <button type="submit" disabled={busy} className="btn btn-p w-full">
            {busy ? <Icon n="loader" c="w-4 h-4 spin" /> : null}
            {busy ? 'Signing in' : 'Sign in'}
          </button>
          <div className="text-center text-sm mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setForgot(true)}
              className="underline underline-offset-4"
            >
              Forgot your password?
            </button>
            <p className="text-mut">
              New to Phiny?{' '}
              <button
                type="button"
                onClick={onSignup}
                className="text-fg underline underline-offset-4"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      )}
    </Dialog>
  );
}
