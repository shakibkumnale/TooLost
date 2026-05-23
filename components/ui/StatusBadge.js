import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    draft: {
      bg: 'rgba(142, 146, 158, 0.1)',
      color: '#8e929e',
      border: '1px solid rgba(142, 146, 158, 0.2)',
      label: 'Draft'
    },
    in_review: {
      bg: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      label: 'In Review'
    },
    live: {
      bg: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      label: 'Live'
    },
    takedown_pending: {
      bg: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      label: 'Takedown Pending'
    },
    takedown_complete: {
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      label: 'Takedown Complete'
    }
  };

  const current = styles[status] || styles.draft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}
    >
      {current.label}
    </span>
  );
}
