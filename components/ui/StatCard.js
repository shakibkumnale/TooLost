import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, trend, trendType = 'up' }) {
  return (
    <div className="glass-card" style={cardStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>{title}</span>
        {Icon && (
          <div style={iconWrapperStyle}>
            <Icon size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
        )}
      </div>

      <div style={contentStyle}>
        <h3 style={valueStyle}>{value}</h3>
        {trend && (
          <span 
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: trendType === 'up' ? 'var(--success)' : 'var(--danger)',
              background: trendType === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p style={descriptionStyle}>{description}</p>
      )}
    </div>
  );
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1rem',
  minHeight: '130px',
  position: 'relative',
  overflow: 'hidden',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle = {
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const iconWrapperStyle = {
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(0, 255, 135, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(0, 255, 135, 0.1)',
};

const contentStyle = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.75rem',
};

const valueStyle = {
  fontSize: '1.85rem',
  fontWeight: '800',
  color: '#fff',
  letterSpacing: '-0.02em',
};

const descriptionStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
};
