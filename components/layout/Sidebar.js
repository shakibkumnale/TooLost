'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Music, 
  BarChart3, 
  DollarSign, 
  Users, 
  User,
  Disc
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Releases', path: '/releases', icon: Music },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Earnings', path: '/earnings', icon: DollarSign },
    { name: 'Artists', path: '/artists', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside style={sidebarStyle} className="glass">
      <div style={logoContainerStyle}>
        <Disc size={28} style={{ color: 'var(--color-primary)' }} />
        <span style={logoTextStyle}>WAVE<span style={{ color: 'var(--color-primary)' }}>VAULT</span></span>
      </div>

      <nav style={navStyle}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

          return (
            <Link key={item.path} href={item.path} style={linkStyle(isActive)}>
              <Icon size={20} style={iconStyle(isActive)} />
              <span>{item.name}</span>
              {isActive && <div style={activeIndicatorStyle} />}
            </Link>
          );
        })}
      </nav>

      <div style={footerStyle}>
        <span style={footerTextStyle}>Too Lost Distribution</span>
      </div>
    </aside>
  );
}

const sidebarStyle = {
  width: '260px',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  borderRight: '1px solid var(--border-color)',
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '2.5rem 1.5rem',
  gap: '0.75rem',
};

const logoTextStyle = {
  fontFamily: 'var(--font-outfit)',
  fontSize: '1.4rem',
  fontWeight: '800',
  letterSpacing: '-0.03em',
  color: '#fff',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '0 1rem',
  flex: 1,
};

const linkStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0.85rem 1rem',
  borderRadius: 'var(--radius-md)',
  color: isActive ? '#fff' : 'var(--text-secondary)',
  textDecoration: 'none',
  fontWeight: isActive ? '600' : '500',
  fontSize: '0.95rem',
  position: 'relative',
  gap: '0.85rem',
  background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
  border: isActive ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
  transition: 'all 0.2s ease',
});

const iconStyle = (isActive) => ({
  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
  transition: 'color 0.2s ease',
});

const activeIndicatorStyle = {
  position: 'absolute',
  right: '12px',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary)',
  boxShadow: '0 0 8px var(--color-primary)',
};

const footerStyle = {
  padding: '1.5rem',
  borderTop: '1px solid var(--border-color)',
};

const footerTextStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
