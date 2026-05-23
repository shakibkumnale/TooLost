'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User, Mail, ShieldCheck, Calendar, Activity, CheckCircle, Award } from 'lucide-react';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch('/api/me');
        if (res.ok) {
          const body = await res.json();
          setUserData(body.data);
        } else {
          // fallback to auth session query
          const sessionRes = await fetch('/api/auth/session');
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            if (sessionData.authenticated) {
              setUserData(sessionData.user);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={loadingContainerStyle}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading profile details...</p>
        </div>
      </DashboardLayout>
    );
  }

  const getInitials = () => {
    if (!userData) return 'U';
    const first = userData.first_name || '';
    const last = userData.last_name || '';
    return (first[0] || '') + (last[0] || '') || userData.username?.substring(0, 2).toUpperCase() || 'U';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        
        {/* Title */}
        <div>
          <h2 style={titleStyle}>User Profile</h2>
          <p style={descStyle}>Manage and review your Too Lost distributor account credentials.</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card" style={profileCardStyle}>
          
          <div style={profileHeaderStyle}>
            <div style={avatarWrapperStyle}>
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Avatar" style={avatarStyle} />
              ) : (
                <div style={avatarFallbackStyle}>{getInitials()}</div>
              )}
            </div>
            
            <div style={profileTitleAreaStyle}>
              <div style={nameRowStyle}>
                <h3 style={nameStyle}>{userData ? `${userData.first_name} ${userData.last_name}` : 'Distributor User'}</h3>
                {userData?.confirmed && (
                  <div style={verifiedBadgeStyle} title="Verified Account">
                    <CheckCircle size={14} fill="var(--color-primary)" color="#000" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <span style={roleTextStyle}>{userData?.type || 'Artist'} Account</span>
              <span style={usernameTextStyle}>@{userData?.username || 'johndoe'}</span>
            </div>
          </div>

          <div style={detailsGridStyle}>
            <div style={detailItemStyle} className="glass">
              <div style={detailHeaderStyle}>
                <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={detailLabelStyle}>Email Address</span>
              </div>
              <span style={detailValueStyle}>{userData?.email || 'N/A'}</span>
            </div>

            <div style={detailItemStyle} className="glass">
              <div style={detailHeaderStyle}>
                <ShieldCheck size={16} style={{ color: 'var(--color-secondary)' }} />
                <span style={detailLabelStyle}>Account ID</span>
              </div>
              <span style={detailValueStyle}>#{userData?.id || 'N/A'}</span>
            </div>

            <div style={detailItemStyle} className="glass">
              <div style={detailHeaderStyle}>
                <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
                <span style={detailLabelStyle}>Registered On</span>
              </div>
              <span style={detailValueStyle}>{formatDate(userData?.created_at)}</span>
            </div>

            <div style={detailItemStyle} className="glass">
              <div style={detailHeaderStyle}>
                <Activity size={16} style={{ color: 'var(--success)' }} />
                <span style={detailLabelStyle}>Account Status</span>
              </div>
              <span style={detailValueStyle}>{userData?.confirmed ? 'Active & Confirmed' : 'Pending Confirmation'}</span>
            </div>
          </div>

          <div style={payoutPreferenceBoxStyle} className="glass">
            <Award size={18} style={{ color: 'var(--color-primary)', marginTop: '2px' }} />
            <div>
              <h5 style={payoutTitleStyle}>Royalty Split Configured</h5>
              <p style={payoutDescStyle}>Your account receives 100% of all primary distributor payouts directly from Too Lost portal. Additional splits can be configured via releases settings.</p>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60vh',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  maxWidth: '800px',
  margin: '0 auto',
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '800',
  color: '#fff',
};

const descStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  marginTop: '4px',
};

const profileCardStyle = {
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2.25rem',
};

const profileHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const avatarWrapperStyle = {
  position: 'relative',
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid rgba(255, 255, 255, 0.05)',
  boxShadow: 'var(--shadow-md)',
};

const avatarFallbackStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'var(--color-accent-gradient)',
  color: '#000',
  fontWeight: '800',
  fontSize: '1.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 25px rgba(0, 255, 135, 0.15)',
};

const profileTitleAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const nameRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const nameStyle = {
  fontSize: '1.6rem',
  fontWeight: '800',
  color: '#fff',
  letterSpacing: '-0.02em',
};

const verifiedBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(0, 255, 135, 0.08)',
  color: 'var(--color-primary)',
  border: '1px solid rgba(0, 255, 135, 0.15)',
  padding: '0.15rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.7rem',
  fontWeight: '700',
};

const roleTextStyle = {
  fontSize: '0.9rem',
  color: 'var(--color-primary)',
  fontWeight: '600',
  textTransform: 'capitalize',
};

const usernameTextStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
};

const detailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.25rem',
};

const detailItemStyle = {
  padding: '1.25rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const detailHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const detailLabelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const detailValueStyle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  color: '#fff',
};

const payoutPreferenceBoxStyle = {
  display: 'flex',
  gap: '12px',
  padding: '1.25rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const payoutTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#fff',
  marginBottom: '2px',
};

const payoutDescStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5',
};
