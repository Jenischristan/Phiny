import type { Metadata } from 'next';
import React from 'react';
import { SettingsView } from '@/components/settings/SettingsView';

export const metadata: Metadata = {
  title: 'Settings | Phiny',
  description: 'Manage your Phiny profile, preferences, appearance, and account settings.',
};

export default function SettingsPage() {
  return <SettingsView />;
}
