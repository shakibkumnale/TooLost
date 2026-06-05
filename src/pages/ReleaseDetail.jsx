import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRelease, updateReleaseMetadata, deleteRelease, submitRelease } from '../lib/endpoints';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { PageHeader, LoadingSpinner } from '../components/UI';
import {
  ArrowLeft, Edit3, Trash2, Send, Disc3, Calendar, Tag, Globe,
  Music2, Eye, Truck, Video, Save, ExternalLink
} from 'lucide-react';

export default function ReleaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchRelease();
  }, [id]);

  async function fetchRelease() {
    setLoading(true);
    try {
      const res = await getRelease(id);
      setRelease(res.data);
      setEditForm({
        title: res.data.title,
        label: res.data.label || '',
        primaryGenre: res.data.primaryGenre || '',
        secondaryGenre: res.data.secondaryGenre || '',
        language: res.data.language || 'en',
        releaseDate: res.data.releaseDate || '',
        cYear: res.data.cYear || '',
        cLine: res.data.cLine || '',
        pYear: res.data.pYear || '',
        pLine: res.data.pLine || '',
      });
    } catch (err) {
      toast.error('Failed to load release');
      navigate('/releases');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await updateReleaseMetadata(id, editForm);
      setRelease(res.data);
      setEditing(false);
      toast.success('Release updated');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteRelease(id);
      toast.success('Release deleted');
      navigate('/releases');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to delete');
    }
    setDeleteModal(false);
  }

  async function handleSubmit() {
    try {
      await submitRelease(id, { acceptTerms: 'true', confirmRights: 'true' });
      toast.success('Release submitted for review!');
      fetchRelease();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit');
    }
    setSubmitModal(false);
  }

  if (loading) return <LoadingSpinner text="Loading release..." />;
  if (!release) return null;

  const isDraft = release.status === 'draft';

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={release.title}
        subtitle={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={release.status} />
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span style={{ color: 'var(--text-secondary)' }}>{release.type}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{release.catalogNumber}</span>
          </div>
        }
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/releases')}>
              <ArrowLeft size={16} /> Back
            </button>
            {isDraft && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/releases/${id}/tracks`)}>
                  <Music2 size={16} /> Manage Tracks
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(true)}>
                  <Trash2 size={16} />
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setSubmitModal(true)}>
                  <Send size={16} /> Submit
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="tabs">
        {['overview', 'tracks', 'delivery', 'video'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-2 stagger">
          {/* Artwork + Basic Info */}
          <div className="card">
            <div className="card-body" style={{ display: 'flex', gap: 24 }}>
              <div style={{
                width: 160, height: 160, borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0,
              }}>
                {release.coverUrl ? (
                  <img src={release.coverUrl} alt={release.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Disc3 size={48} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 12 }}>{release.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                  <InfoRow icon={Tag} label="Type" value={release.type} />
                  <InfoRow icon={Globe} label="Label" value={release.label || '—'} />
                  <InfoRow icon={Calendar} label="Release Date" value={release.releaseDate || 'Not set'} />
                  <InfoRow icon={Music2} label="Genre" value={release.primaryGenre || '—'} />
                  <InfoRow icon={Globe} label="Language" value={release.language || '—'} />
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <div className="card-header">
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Metadata</h4>
              {isDraft && (
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(!editing)}>
                  <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit'}
                </button>
              )}
            </div>
            <div className="card-body">
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Label</label>
                    <input className="form-input" value={editForm.label} onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Release Date</label>
                      <input className="form-input" type="date" value={editForm.releaseDate} onChange={e => setEditForm(f => ({ ...f, releaseDate: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <input className="form-input" value={editForm.language} onChange={e => setEditForm(f => ({ ...f, language: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">© Year</label>
                      <input className="form-input" value={editForm.cYear} onChange={e => setEditForm(f => ({ ...f, cYear: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">© Line</label>
                      <input className="form-input" value={editForm.cLine} onChange={e => setEditForm(f => ({ ...f, cLine: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-end' }}>
                    {saving ? <><div className="spinner spinner-sm" /> Saving...</> : <><Save size={14} /> Save Changes</>}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
                  <InfoRow label="UPC" value={release.upc || 'Not assigned'} />
                  <InfoRow label="Catalog #" value={release.catalogNumber} />
                  <InfoRow label="License" value={release.licenseType || '—'} />
                  <InfoRow label="© Year / Line" value={`${release.cYear || '—'} / ${release.cLine || '—'}`} />
                  <InfoRow label="℗ Year / Line" value={`${release.pYear || '—'} / ${release.pLine || '—'}`} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tracks Tab */}
      {activeTab === 'tracks' && (
        <div className="card">
          <div className="card-header">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Tracks ({release.tracks?.length || 0})</h4>
            {isDraft && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/releases/${id}/tracks`)}>
                <Edit3 size={14} /> Manage Tracks
              </button>
            )}
          </div>
          {release.tracks && release.tracks.length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>ISRC</th>
                    <th>Version</th>
                    <th>Explicit</th>
                  </tr>
                </thead>
                <tbody>
                  {release.tracks.map((track, i) => (
                    <tr key={track.id}>
                      <td className="mono" style={{ color: 'var(--text-tertiary)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{track.title}</td>
                      <td className="mono" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{track.isrc || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{track.version || '—'}</td>
                      <td>{track.lyrics?.explicit ? <span style={{ color: 'var(--rose)' }}>E</span> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <Music2 size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
              <p style={{ color: 'var(--text-secondary)' }}>No tracks added yet</p>
            </div>
          )}
        </div>
      )}

      {/* Delivery Tab */}
      {activeTab === 'delivery' && (
        <div className="card">
          <div className="card-header">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Delivery Settings</h4>
          </div>
          <div className="card-body">
            {release.delivery ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {Object.entries(release.delivery).filter(([k]) => typeof release.delivery[k] === 'boolean').map(([key, value]) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: value ? 'var(--emerald)' : 'var(--text-muted)',
                    }} />
                    <span style={{ fontSize: '0.8125rem', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No delivery settings configured</p>
            )}
          </div>
        </div>
      )}

      {/* Video Tab */}
      {activeTab === 'video' && (
        <div className="card">
          <div className="card-header">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Music Video</h4>
          </div>
          <div className="card-body">
            {release.video?.videoUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem' }}>
                <InfoRow icon={Video} label="Video URL" value={release.video.videoUrl} />
                <InfoRow label="Video Type" value={release.video.videoType || '—'} />
                <InfoRow label="Age Restriction" value={release.video.ageRestriction || '—'} />
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <Video size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                <p style={{ color: 'var(--text-secondary)' }}>No video uploaded</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Release"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }>
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong>"{release.title}"</strong>? This action cannot be undone.
        </p>
      </Modal>

      {/* Submit Modal */}
      <Modal isOpen={submitModal} onClose={() => setSubmitModal(false)} title="Submit Release"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setSubmitModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}><Send size={14} /> Submit</button>
          </>
        }>
        <p style={{ color: 'var(--text-secondary)' }}>
          Submit <strong>"{release.title}"</strong> for review? Once submitted, you won't be able to edit it until the review is complete.
        </p>
      </Modal>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Icon && <Icon size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
      <span style={{ color: 'var(--text-tertiary)', minWidth: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
