'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  Music, Calendar, Tag, ChevronLeft, Trash2, Send, 
  Layers, Globe, Check, AlertCircle, FileAudio 
} from 'lucide-react';
import Link from 'next/link';

export default function ReleaseDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [release, setRelease] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadRelease = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/releases/${id}`);
      
      if (!res.ok) {
        throw new Error('Release not found or you do not have permission to view it.');
      }
      
      const responseBody = await res.json();
      setRelease(responseBody.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelease();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this draft release? This action is permanent.')) return;
    
    try {
      setActionLoading(true);
      const res = await fetch(`/api/releases/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/releases');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete release.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/releases/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptTerms: true,
          confirmRights: true,
          confirmYoutubeRights: true,
          idempotencyKey: `rel-submit-${id}-${Date.now()}`
        })
      });

      if (res.ok) {
        alert('Release submitted successfully into review state!');
        loadRelease();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to submit release. Ensure all metadata and audio are valid.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={loadingContainerStyle}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading release details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !release) {
    return (
      <DashboardLayout>
        <div style={errorContainerStyle} className="glass-card">
          <AlertCircle size={32} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3>Failed to Load Release</h3>
          <p>{error || 'The requested release could not be found.'}</p>
          <Link href="/releases" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
            <ChevronLeft size={16} />
            <span>Back to Releases</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Parse platforms list
  const platformsList = release.platforms && typeof release.platforms === 'string'
    ? release.platforms.split(',')
    : release.delivery 
      ? Object.keys(release.delivery).filter(key => release.delivery[key] === true && key !== 'id')
      : ['Spotify', 'Apple Music', 'YouTube Music'];

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        
        {/* Back Link */}
        <Link href="/releases" style={backLinkStyle}>
          <ChevronLeft size={16} />
          <span>Back to Catalog</span>
        </Link>

        {/* Action Header */}
        <div style={headerStyle}>
          <div style={titleAreaStyle}>
            <h2 style={titleStyle}>{release.title}</h2>
            <div style={badgesStyle}>
              <StatusBadge status={release.status} />
              <span style={typeBadgeStyle}>{release.type}</span>
            </div>
          </div>

          {release.status === 'draft' && (
            <div style={actionButtonsStyle}>
              <button 
                onClick={handleDelete} 
                className="btn btn-danger" 
                disabled={actionLoading}
              >
                <Trash2 size={16} />
                <span>Delete Draft</span>
              </button>
              <button 
                onClick={handleSubmit} 
                className="btn btn-primary" 
                disabled={actionLoading}
                style={{ background: 'var(--color-accent-gradient)' }}
              >
                <Send size={16} />
                <span>Submit for Review</span>
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div style={gridStyle}>
          
          {/* Left Column: Cover art and platforms */}
          <div style={leftColStyle}>
            <div className="glass-card" style={coverCardStyle}>
              {release.coverUrl ? (
                <img src={release.coverUrl} alt={release.title} style={coverImgStyle} />
              ) : (
                <div style={coverPlaceholderStyle}>
                  <Music size={64} style={{ color: 'rgba(255,255,255,0.1)' }} />
                </div>
              )}
              
              <div style={catalogDetailsStyle}>
                <div style={detailRowStyle}>
                  <Tag size={14} style={detailIconStyle} />
                  <div>
                    <span style={detailLabelStyle}>Catalog Number</span>
                    <span style={detailValueStyle}>{release.catalogNumber || `TOOLOST${release.id}`}</span>
                  </div>
                </div>

                <div style={detailRowStyle}>
                  <Calendar size={14} style={detailIconStyle} />
                  <div>
                    <span style={detailLabelStyle}>Release Date</span>
                    <span style={detailValueStyle}>{release.releaseDate || 'Not Scheduled'}</span>
                  </div>
                </div>

                <div style={detailRowStyle}>
                  <Layers size={14} style={detailIconStyle} />
                  <div>
                    <span style={detailLabelStyle}>Record Label</span>
                    <span style={detailValueStyle}>{release.label || 'Independent'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platforms Deliverability */}
            <div className="glass-card" style={platformsCardStyle}>
              <h4 style={panelTitleStyle}>Distributed To</h4>
              <div style={platformsListStyle}>
                {platformsList.map((platform) => (
                  <div key={platform} style={platformItemStyle} className="glass">
                    <Globe size={14} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{platform}</span>
                    <Check size={12} style={{ color: 'var(--success)', marginLeft: 'auto' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata details and Tracks list */}
          <div style={rightColStyle}>
            
            {/* Metadata Panel */}
            <div className="glass-card" style={panelStyle}>
              <h4 style={panelTitleStyle}>Release Information</h4>
              <div style={metadataGridStyle}>
                <div style={metadataItemStyle}>
                  <span style={metaLabelStyle}>Primary Genre</span>
                  <span style={metaValStyle}>{release.primaryGenre || 'Alternative'}</span>
                </div>
                <div style={metadataItemStyle}>
                  <span style={metaLabelStyle}>Secondary Genre</span>
                  <span style={metaValStyle}>{release.secondaryGenre || 'Grunge'}</span>
                </div>
                <div style={metadataItemStyle}>
                  <span style={metaLabelStyle}>Metadata Language</span>
                  <span style={metaValStyle}>{release.language === 'en' ? 'English (en)' : release.language || 'English (en)'}</span>
                </div>
                <div style={metadataItemStyle}>
                  <span style={metaLabelStyle}>License Type</span>
                  <span style={metaValStyle}>{release.licenseType || 'Copyright'}</span>
                </div>
                <div style={metadataItemStyle}>
                  <span style={metaLabelStyle}>C Line</span>
                  <span style={metaValStyle}>{release.cLine || 'None'}</span>
                </div>
                <div style={metadataItemStyle}>
                  <span style={metaLabelStyle}>P Line</span>
                  <span style={metaValStyle}>{release.pLine || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Tracks Panel */}
            <div className="glass-card" style={panelStyle}>
              <h4 style={panelTitleStyle}>Tracks Listing ({release.tracks?.length || 0})</h4>
              
              {!release.tracks || release.tracks.length === 0 ? (
                <div style={noTracksStyle}>
                  <FileAudio size={24} style={{ color: 'var(--text-muted)' }} />
                  <span>No tracks uploaded to this release draft yet.</span>
                </div>
              ) : (
                <div style={tracksListContainerStyle}>
                  {release.tracks.map((track, idx) => (
                    <div key={track.id || idx} style={trackRowStyle} className="glass">
                      <div style={trackInfoAreaStyle}>
                        <span style={trackIndexStyle}>{idx + 1}</span>
                        <div>
                          <span style={trackTitleTextStyle}>{track.title}</span>
                          {track.version && (
                            <span style={trackVersionStyle}>({track.version})</span>
                          )}
                        </div>
                        {track.lyrics?.explicit && (
                          <span style={explicitBadgeStyle}>E</span>
                        )}
                      </div>

                      <div style={trackCodesStyle}>
                        {track.isrc && (
                          <div style={codeItemStyle}>
                            <span style={codeLabelStyle}>ISRC</span>
                            <span style={codeValStyle}>{track.isrc}</span>
                          </div>
                        )}
                        {track.iswc && (
                          <div style={codeItemStyle}>
                            <span style={codeLabelStyle}>ISWC</span>
                            <span style={codeValStyle}>{track.iswc}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

const errorContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '4rem auto',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.85rem',
  fontWeight: '600',
  width: 'fit-content',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1.5rem',
};

const titleAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: '#fff',
  letterSpacing: '-0.02em',
};

const badgesStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const typeBadgeStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-full)',
  padding: '0.25rem 0.75rem',
  fontSize: '0.7rem',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '0.75rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: '1.5rem',
};

const leftColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const rightColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const coverCardStyle = {
  padding: '1rem',
};

const coverImgStyle = {
  width: '100%',
  aspectRatio: '1',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '1rem',
};

const coverPlaceholderStyle = {
  width: '100%',
  aspectRatio: '1',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #1b1b22 0%, #111115 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
};

const catalogDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  padding: '0.5rem 0',
};

const detailRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const detailIconStyle = {
  color: 'var(--text-muted)',
};

const detailLabelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const detailValueStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#fff',
};

const platformsCardStyle = {
  padding: '1.5rem',
};

const panelTitleStyle = {
  fontSize: '1.05rem',
  color: '#fff',
  marginBottom: '1.25rem',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.5rem',
};

const platformsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const platformItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const panelStyle = {
  padding: '1.5rem',
};

const metadataGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '1.25rem',
};

const metadataItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const metaLabelStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const metaValStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#fff',
};

const noTracksStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '2.5rem',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
};

const tracksListContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const trackRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.25rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const trackInfoAreaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const trackIndexStyle = {
  fontFamily: 'var(--font-outfit)',
  fontSize: '1rem',
  fontWeight: '800',
  color: 'var(--color-primary)',
};

const trackTitleTextStyle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  color: '#fff',
};

const trackVersionStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  marginLeft: '6px',
};

const explicitBadgeStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: 'var(--danger)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  width: '18px',
  height: '18px',
  borderRadius: '4px',
  fontSize: '0.65rem',
  fontWeight: '800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const trackCodesStyle = {
  display: 'flex',
  gap: '1.5rem',
};

const codeItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '2px',
};

const codeLabelStyle = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  fontWeight: '700',
};

const codeValStyle = {
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
};
