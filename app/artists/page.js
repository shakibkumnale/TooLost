'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, Plus, Trash2, Link as LinkIcon, AlertCircle, Check } from 'lucide-react';

export default function Artists() {
  const [loading, setLoading] = useState(true);
  const [linkedArtists, setLinkedArtists] = useState([]);
  
  // Search state
  const [platform, setPlatform] = useState('spotify');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadLinkedArtists = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/artists?endpoint=artists');
      if (res.ok) {
        const body = await res.json();
        setLinkedArtists(body.data || []);
      }
    } catch (err) {
      console.error('Failed to load preferences artists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinkedArtists();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      setSearching(true);
      setSearchError('');
      setSearchResults([]);
      
      const endpoint = platform === 'spotify' ? 'spotify-search' : platform === 'youtube' ? 'youtube-search' : 'apple-search';
      const res = await fetch(`/api/artists?endpoint=${endpoint}&q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        throw new Error('Search failed. The platform might be temporarily rate limited.');
      }
      
      const body = await res.json();
      setSearchResults(body.data || []);
    } catch (err) {
      console.error(err);
      setSearchError(err.message || 'Failed to search artists.');
    } finally {
      setSearching(false);
    }
  };

  const handleLinkArtist = async (artist) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/artists?endpoint=artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: artist.name,
          artistId: artist.id,
          platform: platform,
          avatarUrl: artist.images?.[0]?.url || artist.avatar || ''
        })
      });

      if (res.ok) {
        alert('Artist profile linked successfully to your distribution preferences!');
        setSearchResults([]);
        setQuery('');
        loadLinkedArtists();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to link artist.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveArtist = async (artistId) => {
    if (!window.confirm('Are you sure you want to remove this artist preference mapping?')) return;
    
    try {
      setActionLoading(true);
      // Calls preferences remove action
      const res = await fetch('/api/artists?endpoint=remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId: artistId })
      });

      if (res.ok) {
        loadLinkedArtists();
      } else {
        alert('Failed to remove artist preference.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        
        {/* Header */}
        <div>
          <h2 style={titleStyle}>Artist Preferences</h2>
          <p style={descStyle}>Link your artists profile IDs (Spotify, Apple Music, YouTube) to ensure releases arrive on correct profiles.</p>
        </div>

        <div style={gridStyle}>
          
          {/* Left panel: Linked profiles */}
          <div style={colStyle}>
            <div className="glass-card" style={panelStyle}>
              <h4 style={panelTitleStyle}>Linked Artist Profiles</h4>
              
              {loading ? (
                <div style={centerLoaderStyle}>
                  <LoadingSpinner />
                </div>
              ) : linkedArtists.length === 0 ? (
                <div style={emptyPrefStyle}>
                  <AlertCircle size={20} style={{ color: 'var(--text-muted)' }} />
                  <span>No profiles mapped. Use the search tool to link your music profiles.</span>
                </div>
              ) : (
                <div style={linkedListStyle}>
                  {linkedArtists.map((artist) => (
                    <div key={artist.id} style={linkedItemStyle} className="glass">
                      <div style={avatarWrapperStyle}>
                        {artist.avatarUrl ? (
                          <img src={artist.avatarUrl} alt={artist.name} style={avatarStyle} />
                        ) : (
                          <div style={avatarFallbackStyle}>
                            {artist.name?.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div style={infoAreaStyle}>
                        <span style={artistNameStyle}>{artist.name}</span>
                        <span style={artistPlatformStyle}>Platform ID: {artist.artistId || artist.id}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveArtist(artist.id)}
                        style={removeBtnStyle}
                        disabled={actionLoading}
                        title="Remove Mapping"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Search and Map tool */}
          <div style={colStyle}>
            <div className="glass-card" style={panelStyle}>
              <h4 style={panelTitleStyle}>Search & Link Profiles</h4>

              {/* Search Form */}
              <form onSubmit={handleSearch} style={searchFormStyle}>
                <div style={formRowStyle}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <select 
                      value={platform} 
                      onChange={(e) => setPlatform(e.target.value)}
                      className="form-select"
                      style={{ height: '44px' }}
                    >
                      <option value="spotify">Spotify Artist</option>
                      <option value="apple">Apple Music</option>
                      <option value="youtube">YouTube Channel</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0, position: 'relative' }}>
                    <input 
                      type="text"
                      placeholder="Search artist name..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="form-input"
                      style={{ height: '44px' }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 1.25rem' }} disabled={searching}>
                    <Search size={16} />
                  </button>
                </div>
              </form>

              {/* Search Results */}
              <div style={resultsContainerStyle}>
                {searching ? (
                  <div style={centerLoaderStyle}>
                    <LoadingSpinner />
                    <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Searching platforms...</span>
                  </div>
                ) : searchError ? (
                  <div style={searchErrorBoxStyle}>
                    <span>{searchError}</span>
                  </div>
                ) : searchResults.length === 0 && query ? (
                  <div style={emptyResultsStyle}>
                    <span>No results found on this platform. Check the spelling or enter the direct profile URL in Too Lost portal.</span>
                  </div>
                ) : (
                  <div style={resultsListStyle}>
                    {searchResults.map((artist) => (
                      <div key={artist.id} style={resultItemStyle} className="glass">
                        <div style={avatarWrapperStyle}>
                          {artist.images?.[0]?.url || artist.avatar ? (
                            <img src={artist.images?.[0]?.url || artist.avatar} alt={artist.name} style={avatarStyle} />
                          ) : (
                            <div style={avatarFallbackStyle}>
                              {artist.name?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div style={infoAreaStyle}>
                          <span style={artistNameStyle}>{artist.name}</span>
                          <span style={artistPlatformStyle}>Followers: {artist.followers?.total?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <button 
                          onClick={() => handleLinkArtist(artist)}
                          className="btn btn-secondary"
                          style={linkBtnStyle}
                          disabled={actionLoading}
                        >
                          <LinkIcon size={12} />
                          <span>Link</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
};

const colStyle = {
  minWidth: 0,
};

const panelStyle = {
  padding: '1.5rem',
  height: '100%',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
};

const panelTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
  marginBottom: '1.25rem',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.5rem',
};

const centerLoaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '3rem 0',
  flex: 1,
};

const emptyPrefStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '2rem',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  lineHeight: '1.5',
};

const linkedListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const linkedItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const avatarWrapperStyle = {
  position: 'relative',
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid rgba(255,255,255,0.05)',
};

const avatarFallbackStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'var(--bg-surface-elevated)',
  color: 'var(--color-primary)',
  fontWeight: '700',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border-color)',
};

const infoAreaStyle = {
  marginLeft: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const artistNameStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#fff',
};

const artistPlatformStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
};

const removeBtnStyle = {
  marginLeft: 'auto',
  background: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  color: 'var(--danger)',
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const searchFormStyle = {
  marginBottom: '1.5rem',
};

const formRowStyle = {
  display: 'flex',
  gap: '8px',
};

const resultsContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const resultsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const resultItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const linkBtnStyle = {
  marginLeft: 'auto',
  padding: '0.4rem 0.85rem',
  fontSize: '0.75rem',
  height: '30px',
};

const searchErrorBoxStyle = {
  padding: '1rem',
  background: 'rgba(239, 68, 68, 0.1)',
  color: 'var(--danger)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  fontSize: '0.85rem',
};

const emptyResultsStyle = {
  padding: '2rem',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  textAlign: 'center',
  lineHeight: '1.5',
};
