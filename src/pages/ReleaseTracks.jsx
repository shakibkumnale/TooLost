import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRelease, updateReleaseTracks, createTrackUploadUrl } from '../lib/endpoints';
import { useToast } from '../context/ToastContext';
import { PageHeader, LoadingSpinner } from '../components/UI';
import { ArrowLeft, Plus, GripVertical, Trash2, Save, Music2, Upload } from 'lucide-react';

export default function ReleaseTracks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [release, setRelease] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getRelease(id);
        setRelease(res.data);
        setTracks(res.data.tracks || []);
      } catch {
        toast.error('Failed to load release');
        navigate('/releases');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function addTrack() {
    setTracks(prev => [...prev, {
      id: `new-${Date.now()}`,
      title: '',
      version: '',
      isrc: '',
      language: 'en',
      lyrics: { explicit: false, cleanVersion: false },
      _isNew: true,
    }]);
  }

  function updateTrack(index, field, value) {
    setTracks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function removeTrack(index) {
    setTracks(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        tracks: tracks.map((t, i) => ({
          title: t.title,
          version: t.version || null,
          isrc: t.isrc || null,
          language: t.language || 'en',
          lyrics: t.lyrics || { explicit: false },
        })),
      };
      await updateReleaseTracks(id, payload);
      toast.success('Tracks saved');
      const res = await getRelease(id);
      setTracks(res.data.tracks || []);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to save tracks');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner text="Loading tracks..." />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={`Tracks — ${release?.title || ''}`}
        subtitle={`Manage tracks for this ${release?.type || 'release'}`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/releases/${id}`)}>
              <ArrowLeft size={16} /> Back to Release
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? <><div className="spinner spinner-sm" /> Saving...</> : <><Save size={16} /> Save Tracks</>}
            </button>
          </div>
        }
      />

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {tracks.length === 0 ? (
            <div className="empty-state" style={{ padding: '48px 20px' }}>
              <div className="empty-state-icon"><Music2 size={32} /></div>
              <h3 className="empty-state-title">No tracks yet</h3>
              <p className="empty-state-text">Add tracks to your release</p>
              <button className="btn btn-primary" onClick={addTrack}><Plus size={16} /> Add Track</button>
            </div>
          ) : (
            <>
              {tracks.map((track, i) => (
                <div key={track.id || i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}>
                  <div style={{
                    color: 'var(--text-muted)', paddingTop: 10,
                    minWidth: 24, textAlign: 'center', fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.6875rem' }}>Title</label>
                      <input className="form-input" placeholder="Track title" value={track.title}
                        onChange={e => updateTrack(i, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.6875rem' }}>Version</label>
                      <input className="form-input" placeholder="e.g. Extended Mix" value={track.version || ''}
                        onChange={e => updateTrack(i, 'version', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.6875rem' }}>ISRC</label>
                      <input className="form-input" placeholder="ISRC code" value={track.isrc || ''}
                        onChange={e => updateTrack(i, 'isrc', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn btn-icon btn-ghost btn-sm" onClick={() => removeTrack(i)}
                    style={{ marginTop: 24 }}>
                    <Trash2 size={14} style={{ color: 'var(--rose)' }} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-secondary btn-sm" onClick={addTrack}>
            <Plus size={14} /> Add Track
          </button>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            {tracks.length} track{tracks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
