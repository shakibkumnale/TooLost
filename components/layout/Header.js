'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, User as UserIcon } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setUserData(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to load session details', err);
      }
    }
    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  const getInitials = () => {
    if (!userData) return 'U';
    const first = userData.first_name || '';
    const last = userData.last_name || '';
    return (first[0] || '') + (last[0] || '') || userData.username?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header style={headerStyle} className="glass">
      <div style={welcomeStyle}>
        <span style={subtitleStyle}>Overview</span>
        <h2 style={titleStyle}>
          {userData ? `Welcome back, ${userData.first_name || userData.username}` : 'WaveVault Studio'}
        </h2>
      </div>

      <div style={actionsStyle}>
        <button style={iconButtonStyle} title="Notifications">
          <Bell size={18} />
        </button>

        <div style={dividerStyle} />

        <div style={userProfileStyle}>
          {userData?.avatar ? (
            <img src={userData.avatar} alt="Avatar" style={avatarStyle} />
          ) : (
            <div style={avatarFallbackStyle}>{getInitials()}</div>
          )}
          <div style={userInfoStyle}>
            <span style={userNameStyle}>{userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}</span>
            <span style={userRoleStyle}>{userData?.type || 'Artist'}</span>
          </div>
        </div>

        <button onClick={handleLogout} style={logoutButtonStyle} title="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

const headerStyle = {
  height: '75px',
  width: 'calc(100% - 260px)',
  marginLeft: '260px',
  position: 'fixed',
  top: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  zIndex: 90,
  borderBottom: '1px solid var(--border-color)',
};

const welcomeStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const subtitleStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  fontWeight: '700',
  letterSpacing: '0.05em',
};

const titleStyle = {
  fontSize: '1.15rem',
  fontWeight: '700',
  color: '#fff',
  marginTop: '2px',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
};

const iconButtonStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const dividerStyle = {
  width: '1px',
  height: '24px',
  backgroundColor: 'var(--border-color)',
};

const userProfileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const avatarStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid rgba(255, 255, 255, 0.05)',
};

const avatarFallbackStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: 'var(--color-accent-gradient)',
  color: '#000',
  fontWeight: '700',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 10px rgba(0, 255, 135, 0.1)',
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const userNameStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#fff',
};

const userRoleStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-secondary)',
  textTransform: 'capitalize',
};

const logoutButtonStyle = {
  background: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  borderRadius: 'var(--radius-md)',
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--danger)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};
