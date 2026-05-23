import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div style={layoutStyle}>
      <Sidebar />
      <Header />
      <main style={mainContentStyle}>
        {children}
      </main>
    </div>
  );
}

const layoutStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--bg-base)',
};

const mainContentStyle = {
  marginLeft: '260px',
  paddingTop: '95px', // header height + extra padding
  paddingLeft: '2.5rem',
  paddingRight: '2.5rem',
  paddingBottom: '4rem',
  minHeight: 'calc(100vh - 75px)',
};
