import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listReleases } from '../lib/endpoints';
import StatusBadge from '../components/StatusBadge';
import { PageHeader } from '../components/UI';
import { Plus, Search, Disc3, Calendar, LayoutGrid, List } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In Review' },
  { value: 'live', label: 'Live' },
  { value: 'takedown_pending', label: 'Takedown Pending' },
  { value: 'takedown_complete', label: 'Taken Down' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Single', label: 'Single' },
  { value: 'EP', label: 'EP' },
  { value: 'Album', label: 'Album' },
  { value: 'Compilation', label: 'Compilation' },
  { value: 'MusicVideo', label: 'Music Video' },
];

export default function Releases() {
  const navigate = useNavigate();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchReleases();
  }, [page, status, type]);

  async function fetchReleases(searchQuery) {
    setLoading(true);
    try {
      const params = { page, perPage: 12 };
      if (status) params.status = status;
      if (type) params.type = type;
      if (searchQuery !== undefined ? searchQuery : search) params.search = searchQuery !== undefined ? searchQuery : search;

      const res = await listReleases(params);
      setReleases(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load releases:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchReleases(search);
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Releases"
        subtitle="Manage all your music releases"
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/releases/new')}>
            <Plus size={18} /> New Release
          </button>
        }
      />

      {/* Filters */}
      <div className="filters-row">
        <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Search releases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ width: 160 }}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select className="form-select" value={type} onChange={e => { setType(e.target.value); setPage(1); }}
          style={{ width: 140 }}>
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button
            className={`btn-icon btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`btn-icon btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'release-grid' : ''}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{
              height: viewMode === 'grid' ? 320 : 64,
              borderRadius: 'var(--radius-lg)',
              marginBottom: viewMode === 'list' ? 8 : 0,
            }} />
          ))}
        </div>
      ) : releases.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Disc3 size={32} />
            </div>
            <h3 className="empty-state-title">No releases found</h3>
            <p className="empty-state-text">
              {search || status || type
                ? 'Try adjusting your filters or search query.'
                : "You haven't created any releases yet. Get started by creating your first one!"}
            </p>
            {!search && !status && !type && (
              <button className="btn btn-primary" onClick={() => navigate('/releases/new')}>
                <Plus size={18} /> Create Release
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="release-grid stagger">
          {releases.map((release) => (
            <div
              key={release.id}
              className="release-card"
              onClick={() => navigate(`/releases/${release.id}`)}
            >
              <div className="release-card-cover">
                {release.compressedArtwork || release.coverUrl ? (
                  <img src={release.compressedArtwork || release.coverUrl} alt={release.title} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-elevated))',
                  }}>
                    <Disc3 size={48} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                  </div>
                )}
                <div className="release-card-status">
                  <StatusBadge status={release.status} />
                </div>
              </div>
              <div className="release-card-body">
                <div className="release-card-title">{release.title}</div>
                <div className="release-card-meta">
                  <span className="release-card-type">{release.type}</span>
                  {release.releaseDate && (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} />
                        {release.releaseDate}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Release</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Label</th>
                  <th>Release Date</th>
                  <th>Tracks</th>
                </tr>
              </thead>
              <tbody>
                {releases.map((release) => (
                  <tr key={release.id} onClick={() => navigate(`/releases/${release.id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0,
                        }}>
                          {(release.compressedArtwork || release.coverUrl) ? (
                            <img src={release.compressedArtwork || release.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                              <Disc3 size={14} />
                            </div>
                          )}
                        </div>
                        <span style={{ fontWeight: 600 }}>{release.title}</span>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-secondary)' }}>{release.type}</span></td>
                    <td><StatusBadge status={release.status} /></td>
                    <td><span style={{ color: 'var(--text-secondary)' }}>{release.label || '—'}</span></td>
                    <td><span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{release.releaseDate || '—'}</span></td>
                    <td><span className="mono">{release.tracks?.length || 0}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: 20 }}>
          <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>←</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>→</button>
        </div>
      )}
    </div>
  );
}
