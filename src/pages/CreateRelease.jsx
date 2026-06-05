import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRelease, listGenres, listLanguages } from '../lib/endpoints';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/UI';
import { ArrowLeft, ArrowRight, Check, Disc3, Music2, UserPlus, X } from 'lucide-react';

const STEPS = ['Basic Info', 'Metadata', 'Participants', 'Review'];
const TYPES = ['Single', 'EP', 'Album', 'Compilation', 'MusicVideo'];

export default function CreateRelease() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [form, setForm] = useState({
    type: 'Single',
    title: '',
    label: '',
    primaryGenre: '',
    secondaryGenre: '',
    language: 'en',
    participants: [{ name: '', role: ['primary'], artistId: null }],
  });

  useEffect(() => {
    async function loadRef() {
      try {
        const [g, l] = await Promise.all([listGenres(), listLanguages()]);
        setGenres(g.data || g || []);
        setLanguages(l.data || l || []);
      } catch { /* Reference data may not be available */ }
    }
    loadRef();
  }, []);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function addParticipant() {
    setForm(prev => ({
      ...prev,
      participants: [...prev.participants, { name: '', role: ['primary'], artistId: null }],
    }));
  }

  function updateParticipant(index, field, value) {
    setForm(prev => {
      const participants = [...prev.participants];
      participants[index] = { ...participants[index], [field]: value };
      return { ...prev, participants };
    });
  }

  function removeParticipant(index) {
    setForm(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      toast.error('Please enter a release title');
      return;
    }
    if (form.participants.length === 0 || !form.participants[0].name.trim()) {
      toast.error('Please add at least one participant');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: form.type,
        title: form.title,
        label: form.label || null,
        participants: form.participants.filter(p => p.name.trim()).map(p => ({
          name: p.name,
          role: p.role,
          ...(p.artistId && { artistId: p.artistId }),
        })),
      };
      const res = await createRelease(payload);
      toast.success('Release created successfully!');
      navigate(`/releases/${res.data.id}`);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create release');
    } finally {
      setSubmitting(false);
    }
  }

  function canProceed() {
    if (step === 0) return form.title.trim().length > 0;
    if (step === 2) return form.participants.length > 0 && form.participants[0].name.trim().length > 0;
    return true;
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Create Release"
        subtitle="Set up a new draft release"
        actions={
          <button className="btn btn-ghost" onClick={() => navigate('/releases')}>
            <ArrowLeft size={18} /> Cancel
          </button>
        }
      />

      {/* Wizard Steps */}
      <div className="wizard-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`wizard-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="wizard-step-dot">
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="wizard-step-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Release Type *</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TYPES.map(t => (
                    <button
                      key={t}
                      className={`btn btn-sm ${form.type === t ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => update('type', t)}
                      type="button"
                    >
                      {t === 'MusicVideo' ? 'Music Video' : t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="Enter release title"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Label</label>
                <input
                  className="form-input"
                  placeholder="Label name (optional)"
                  value={form.label}
                  onChange={e => update('label', e.target.value)}
                  maxLength={120}
                />
              </div>
            </div>
          )}

          {/* Step 1: Metadata */}
          {step === 1 && (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                These fields are optional during creation. You can update them later from the release detail page.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Primary Genre</label>
                  <select className="form-select" value={form.primaryGenre} onChange={e => update('primaryGenre', e.target.value)}>
                    <option value="">Select genre</option>
                    {Array.isArray(genres) && genres.map((g, i) => (
                      <option key={i} value={typeof g === 'string' ? g : g.name || g.value}>{typeof g === 'string' ? g : g.name || g.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Secondary Genre</label>
                  <select className="form-select" value={form.secondaryGenre} onChange={e => update('secondaryGenre', e.target.value)}>
                    <option value="">Select genre</option>
                    {Array.isArray(genres) && genres.map((g, i) => (
                      <option key={i} value={typeof g === 'string' ? g : g.name || g.value}>{typeof g === 'string' ? g : g.name || g.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-select" value={form.language} onChange={e => update('language', e.target.value)}>
                  <option value="en">English</option>
                  {Array.isArray(languages) && languages.map((l, i) => (
                    <option key={i} value={typeof l === 'string' ? l : l.code || l.value}>{typeof l === 'string' ? l : l.name || l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Participants */}
          {step === 2 && (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Add the artists involved in this release. At least one primary artist is required.
              </p>
              {form.participants.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-end',
                  padding: 16, borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Artist Name *</label>
                    <input className="form-input" placeholder="Artist name" value={p.name}
                      onChange={e => updateParticipant(i, 'name', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ width: 140 }}>
                    <label className="form-label">Role</label>
                    <select className="form-select" value={p.role[0]}
                      onChange={e => updateParticipant(i, 'role', [e.target.value])}>
                      <option value="primary">Primary</option>
                      <option value="featured">Featured</option>
                      <option value="remixer">Remixer</option>
                    </select>
                  </div>
                  {form.participants.length > 1 && (
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => removeParticipant(i)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" onClick={addParticipant} style={{ alignSelf: 'flex-start' }}>
                <UserPlus size={16} /> Add Participant
              </button>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4>Review Your Release</h4>
              <div style={{
                padding: 20, borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 16px' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>Type</span>
                  <span style={{ fontWeight: 600 }}>{form.type}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>Title</span>
                  <span style={{ fontWeight: 600 }}>{form.title}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>Label</span>
                  <span>{form.label || '—'}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>Artists</span>
                  <span>{form.participants.filter(p => p.name).map(p => `${p.name} (${p.role[0]})`).join(', ')}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                This will create a draft release. You can add tracks, artwork, and delivery details from the release detail page.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <><div className="spinner spinner-sm" /> Creating...</> : <><Disc3 size={16} /> Create Release</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
