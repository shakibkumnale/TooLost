import React from 'react';
import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, description, actionText, actionLink, actionOnClick }) {
  return (
    <div style={containerStyle} className="glass-card">
      {Icon && (
        <div style={iconWrapperStyle}>
          <Icon size={32} style={{ color: 'var(--color-primary)' }} />
        </div>
      )}
      <h3 style={titleStyle}>{title}</h3>
      <p style={descStyle}>{description}</p>
      
      {actionText && (
        actionLink ? (
          <Link href={actionLink} className="btn btn-primary" style={btnStyle}>
            {actionText}
          </Link>
        ) : (
          <button onClick={actionOnClick} className="btn btn-primary" style={btnStyle}>
            {actionText}
          </button>
        )
      )}
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '2rem auto',
};

const iconWrapperStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'rgba(0, 255, 135, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(0, 255, 135, 0.1)',
  marginBottom: '1.5rem',
  boxShadow: '0 0 20px rgba(0, 255, 135, 0.05)',
};

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#fff',
  marginBottom: '0.5rem',
};

const descStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.6',
  marginBottom: '1.5rem',
};

const btnStyle = {
  padding: '0.65rem 1.25rem',
  fontSize: '0.875rem',
};
