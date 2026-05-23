import React from 'react';
import Link from 'next/link';
import { Music, Eye, Calendar, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReleaseCard({ release }) {
  const { id, title, type, status, coverUrl, catalogNumber, releaseDate } = release;

  return (
    <div className="glass-card" style={cardStyle}>
      <div style={imageContainerStyle}>
        {coverUrl ? (
          <img src={coverUrl} alt={title} style={imageStyle} />
        ) : (
          <div style={placeholderImageStyle}>
            <Music size={36} style={{ color: 'rgba(255, 255, 255, 0.2)' }} />
          </div>
        )}
        <div style={badgeOverlayStyle}>
          <StatusBadge status={status} />
        </div>
      </div>

      <div style={bodyStyle}>
        <span style={typeStyle}>{type}</span>
        <h4 style={titleStyle} title={title}>{title}</h4>
        
        <div style={metaContainerStyle}>
          <div style={metaItemStyle}>
            <Tag size={12} />
            <span style={metaTextStyle}>{catalogNumber || `ID: ${id}`}</span>
          </div>
          <div style={metaItemStyle}>
            <Calendar size={12} />
            <span style={metaTextStyle}>{releaseDate || 'TBD'}</span>
          </div>
        </div>

        <Link href={`/releases/${id}`} className="btn btn-secondary" style={viewBtnStyle}>
          <Eye size={14} />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem',
  borderRadius: 'var(--radius-md)',
  height: '100%',
  position: 'relative',
};

const imageContainerStyle = {
  position: 'relative',
  width: '100%',
  paddingBottom: '100%', // 1:1 Aspect Ratio
  borderRadius: '8px',
  overflow: 'hidden',
  background: '#121216',
};

const imageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const placeholderImageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1b1b22 0%, #111115 100%)',
};

const badgeOverlayStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  zIndex: 5,
};

const bodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem 0.25rem 0.25rem 0.25rem',
  flex: 1,
};

const typeStyle = {
  fontSize: '0.7rem',
  fontWeight: '700',
  color: 'var(--color-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '4px',
};

const titleStyle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  color: '#fff',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const metaContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '1rem',
};

const metaItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: 'var(--text-muted)',
};

const metaTextStyle = {
  fontSize: '0.75rem',
  fontWeight: '500',
};

const viewBtnStyle = {
  width: '100%',
  padding: '0.5rem',
  fontSize: '0.8rem',
  marginTop: 'auto',
};
