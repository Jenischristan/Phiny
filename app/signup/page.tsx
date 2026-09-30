'use client';

import React from 'react';
import { SignupView } from '@/components/auth/SignupView';
import { useC } from '@/context/PhinyContext';

export default function SignupPage() {
  const c = useC();
  return <SignupView onExit={c.onSignupExit} onDone={c.onSignupDone} />;
}
