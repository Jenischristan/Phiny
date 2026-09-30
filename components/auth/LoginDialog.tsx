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

  const E: Record<string, string> = {
    id: v.id.trim() ? '' : 'Enter your username or email.',
    pw: v.pw ? '' : 'Enter your password.',
  };
  const sh = (k: string) => (t[k] ? E[k] : '');

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (E.id || E.pw) {
      setT({ id: 1, pw: 1 });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setV({ id: '', pw: '', keep: true });
      setT({});
      onLogin(v.id);
    }, 700);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label="Sign in to Phiny"
      desc="Enter your username or email and password to sign in."
    >
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
            onClick={() => toast('Reset link sent if the account exists.')}
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
    </Dialog>
  );
}
