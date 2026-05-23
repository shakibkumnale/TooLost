import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReleaseWizard from '@/components/releases/ReleaseWizard';

export const metadata = {
  title: 'Create Release - WaveVault',
  description: 'Deliver your music draft globally to over 150 stores using the Too Lost OAuth API distribution system.'
};

export default function NewReleasePage() {
  return (
    <DashboardLayout>
      <div style={containerStyle}>
        <ReleaseWizard />
      </div>
    </DashboardLayout>
  );
}

const containerStyle = {
  paddingTop: '1rem',
};
