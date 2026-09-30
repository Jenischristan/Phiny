'use client';

import React from 'react';
import { AccountSwitcherDialog } from '@/components/auth/AccountSwitcherDialog';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { AddToDialog } from '@/components/collections/AddToDialog';
import { CollDialog } from '@/components/collections/CollDialog';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MsgsSheet } from '@/components/messages/MsgsSheet';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { ReportDialog } from '@/components/modals/ReportDialog';
import { NotifsSheet } from '@/components/notifications/NotifsSheet';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { UserCard } from '@/components/profile/UserCard';
import { Toaster } from '@/components/ui/Toaster';
import { useC } from '@/context/PhinyContext';
import { PEOPLE } from '@/data/mockData';

export function AppShell({ children }: { children: React.ReactNode }) {
  const c = useC();
  const r = c.route;
  const isSignup = c.screen === 'signup';

  return (
    <>
      <div id="shell">
        {isSignup ? (
          children
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <Header />
              <div className="flex">
                <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 md:pb-8">
                  <div key={r + ':' + String(c.rid)} className="rise">
                    {children}
                  </div>
                </main>
                {(r === 'home' || r === 'explore') && (
                  <aside
                    aria-label="Suggested creators"
                    className="hidden 2xl:block w-80 shrink-0 border-l border-line p-6"
                  >
                    <h2 className="lbl mb-4">Creators to follow</h2>
                    <div className="space-y-3">
                      {PEOPLE.slice(0, 4).map((p) => (
                        <UserCard
                          key={p.id}
                          p={p}
                          on={!!c.fol[p.id]}
                          toggle={() => c.toggleFol(p.id)}
                        />
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </div>
            <BottomNav />
          </div>
        )}
      </div>
      <LoginDialog
        why={c.why}
        open={c.login}
        onClose={c.onLoginClose}
        onSignup={c.onLoginSignup}
        onLogin={c.onLoginSuccess}
      />
      <AccountSwitcherDialog />
      <NotifsSheet />
      <MsgsSheet />
      <AddToDialog />
      <CollDialog />
      <EditProfileDialog />
      <ReportDialog />
      <ConfirmDialog
        open={c.cfo}
        {...c.cf}
        onCancel={() => c.setCfo(false)}
        onOk={() => {
          c.setCfo(false);
          c.cf.ok && c.cf.ok();
        }}
      />
      <Toaster />
    </>
  );
}
