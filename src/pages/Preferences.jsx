import { useState, useEffect } from 'react';
import {
  getArtistPreferences, getPreferenceArtists, getLabelPreferences,
  searchSpotifyArtists, searchYoutubeChannels, searchAppleMusicArtists,
  submitArtistPreferences, removeArtist
} from '../lib/endpoints';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { PageHeader, LoadingSpinner } from '../components/UI';
import { Sliders, Search, Plus, Trash2, Music2, ExternalLink, Link2 } from 'lucide-react';

export default function Preferences() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('artist');
  const [preferences, setPreferences] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [searchPlatform, setSearchPlatform] = useState('spotify');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'artist') {
        const [prefs, arts] = await Promise.allSettled([
          getArtistPreferences(),
          getPreferenceArtists(),
        ]);
        if (prefs.status === 'fulfilled') setPreferences(prefs.value.data || prefs.value);
        if (arts.status === 'fulfilled') setArtists(arts.value.data || arts.value || []);
      } else {
        const res = await getLabelPreferences();
        setPreferences(res.data || res);
      }
    } catch { /* first load may fail */ }
    finally { setLoading(false); }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      let res;
      if (searchPlatform === 'spotify') {
        res = await searchSpotifyArtists({ q: searchQuery });
      } else if (searchPlatform === 'youtube') {
        res = await searchYoutubeChannels({ q: searchQuery });
      } else {
        res = await searchAppleMusicArtists({ q: searchQuery });
      }
      setSearchResults(res.data || res || []);
    } catch {
      toast.error('Search failed');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function handleRemoveArtist(artistData) {
    try {
      await removeArtist(artistData);
      toast.success('Artist removed');
      fetchData();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to remove');
    }
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Preferences"
        subtitle="Manage your artist and label preferences"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setSearchModal(true)}>
            <Plus size={16} /> Link Artist
          </button>
        }
      />

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'artist' ? 'active' : ''}`} onClick={() => setActiveTab('artist')}>
          Artist Preferences
        </button>
        <button className={`tab ${activeTab === 'label' ? 'active' : ''}`} onClick={() => setActiveTab('label')}>
          Label Preferences
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading preferences..." />
      ) : (
        <div>
          {/* Linked Artists */}
          {activeTab === 'artist' && (
            <div className="card">
              <div className="card-header">
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Linked Artists</h4>
              </div>
              {Array.isArray(artists) && artists.length > 0 ? (
                <div style={{ padding: 0 }}>
                  {artists.map((artist, i) => (
                    <div key={artist.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {artist.image || artist.avatar ? (
                          <img src={artist.image || artist.avatar} alt={artist.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Music2 size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{artist.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', gap: 8 }}>
                          {artist.platform && <span style={{ textTransform: 'capitalize' }}>{artist.platform}</span>}
                          {artist.externalId && <span>#{artist.externalId}</span>}
                        </div>
                      </div>
                      {artist.url && (
                        <a href={artist.url} target="_blank" rel="noopener noreferrer" className="btn btn-icon btn-ghost btn-sm">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleRemoveArtist({ id: artist.id })}>
                        <Trash2 size={14} style={{ color: 'var(--rose)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <div className="empty-state-icon"><Link2 size={32} /></div>
                  <h3 className="empty-state-title">No linked artists</h3>
                  <p className="empty-state-text">Link your Spotify, Apple Music, or YouTube artist profiles.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setSearchModal(true)}>
                    <Plus size={16} /> Link Artist
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Label Preferences */}
          {activeTab === 'label' && (
            <div className="card">
              <div className="card-header">
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Label Settings</h4>
              </div>
              <div className="card-body">
                {preferences ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem' }}>
                    {Object.entries(preferences).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', gap: 12 }}>
                        <span style={{ color: 'var(--text-tertiary)', minWidth: 140, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || '—')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No label preferences configured yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Modal */}
      <Modal isOpen={searchModal} onClose={() => { setSearchModal(false); setSearchResults([]); setSearchQuery(''); }}
        title="Link Artist Profile" size="lg">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['spotify', 'youtube', 'apple-music'].map(p => (
            <button key={p} className={`btn btn-sm ${searchPlatform === p ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSearchPlatform(p)} style={{ textTransform: 'capitalize' }}>
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <div className="search-bar" style={{ flex: 1, maxWidth: 'none' }}>
            <Search size={16} className="search-bar-icon" />
            <input type="text" placeholder={`Search ${searchPlatform} artists...`}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={searching}>
            {searching ? <div className="spinner spinner-sm" /> : 'Search'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {searchResults.map((result, i) => (
              <div key={result.id || i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 'var(--radius-md)', marginBottom: 4,
                cursor: 'pointer', transition: 'background var(--transition-fast)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={async () => {
                  try {
                    await submitArtistPreferences({ platform: searchPlatform, externalId: result.id, name: result.name });
                    toast.success(`${result.name} linked!`);
                    setSearchModal(false);
                    setSearchResults([]);
                    fetchData();
                  } catch (err) { toast.error(err.data?.message || 'Failed to link'); }
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0,
                }}>
                  {result.image ? (
                    <img src={result.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Music2 size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{result.name}</div>
                  {result.followers && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{result.followers.toLocaleString()} followers</div>}
                </div>
                <Plus size={16} style={{ color: 'var(--brand-accent)' }} />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
