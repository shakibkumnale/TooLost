'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Check, ArrowRight, ArrowLeft, Upload, Globe, Trash2, Plus, Info } from 'lucide-react';

export default function ReleaseWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Wizards Form Data
  const [formData, setFormData] = useState({
    title: '',
    type: 'Single',
    label: '',
    artistName: '',
    primaryGenre: 'Alternative/Gothic',
    secondaryGenre: 'Alternative/Grunge',
    language: 'en',
    releaseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days in future
    coverUrl: '',
    licenseType: 'Copyright',
    cLine: '',
    pLine: '',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'Amazon Music'],
    territories: ['Worldwide'],
    tracks: [
      { id: Date.now(), title: 'Track One', version: 'Original Mix', isrc: '', iswc: '', explicit: false }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (platform) => {
    setFormData(prev => {
      const active = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: active };
    });
  };

  // Tracks Actions
  const handleTrackChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const addTrack = () => {
    setFormData(prev => ({
      ...prev,
      tracks: [...prev.tracks, { id: Date.now(), title: `Track ${prev.tracks.length + 1}`, version: 'Original Mix', isrc: '', iswc: '', explicit: false }]
    }));
  };

  const removeTrack = (id) => {
    if (formData.tracks.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.filter(t => t.id !== id)
    }));
  };

  // Submit Handler
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // First: Create Draft
      const draftRes = await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          label: formData.label || 'Independent',
          participants: [
            {
              name: formData.artistName || 'Various Artists',
              role: ['primary']
            }
          ]
        })
      });

      const draftResult = await draftRes.json();
      if (!draftRes.ok) {
        throw new Error(draftResult.message || 'Failed to create release draft');
      }

      const releaseId = draftResult.data.id;

      // Second: Update Metadata
      const metaRes = await fetch(`/api/releases/${releaseId}/metadata`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          label: formData.label,
          primaryGenre: formData.primaryGenre,
          secondaryGenre: formData.secondaryGenre,
          language: formData.language,
          releaseDate: formData.releaseDate,
          licenseType: formData.licenseType,
          cLine: formData.cLine || `${new Date().getFullYear()} ${formData.label}`,
          pLine: formData.pLine || `${new Date().getFullYear()} ${formData.label}`,
          coverUrl: formData.coverUrl || 'https://s3.amazonaws.com/bucket/artwork.jpg',
          coverSongs: []
        })
      });

      if (!metaRes.ok) {
        const metaErr = await metaRes.json();
        throw new Error(metaErr.message || 'Failed to update release metadata');
      }

      // Third: Update Delivery
      const deliveryRes = await fetch(`/api/releases/${releaseId}/delivery`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery: {
            platforms: formData.platforms,
            territories: formData.territories.includes('Worldwide') ? ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'IN', 'AU'] : formData.territories,
            additional: { youtube: true }
          }
        })
      });

      if (!deliveryRes.ok) {
        const delivErr = await deliveryRes.json();
        throw new Error(delivErr.message || 'Failed to configure release delivery');
      }

      // Fourth: Submit Release into Review
      const submitRes = await fetch(`/api/releases/${releaseId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptTerms: true,
          confirmRights: true,
          confirmYoutubeRights: true,
          idempotencyKey: `rel-submit-${releaseId}-${Date.now()}`
        })
      });

      if (!submitRes.ok) {
        const submitErr = await submitRes.json();
        throw new Error(submitErr.message || 'Failed to submit release for review');
      }

      // Navigate to success or releases list
      router.push('/releases?success=true');
      router.refresh();

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // Basic validation
    if (step === 1) {
      if (!formData.title || !formData.artistName) {
        setError('Release Title and Artist Name are required.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const allGenres = [
    'Alternative/Gothic', 'Alternative/Grunge', 'Dance/Electronic', 'Hip-Hop/Rap', 
    'Pop', 'Rock', 'R&B/Soul', 'Jazz', 'Classical', 'Latin', 'Reggae', 'World'
  ];

  const allPlatforms = [
    'Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Deezer', 
    'SoundCloud', 'Beatport', 'Tidal', 'TikTok', 'Instagram/Facebook'
  ];

  return (
    <div style={containerStyle}>
      {/* Step Indicators */}
      <div style={stepHeaderStyle}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} style={stepIndicatorStyle(s, step)}>
            <div style={stepCircleStyle(s, step)}>
              {s < step ? <Check size={14} /> : s}
            </div>
            <span style={stepLabelStyle(s, step)}>
              {s === 1 && 'Release Info'}
              {s === 2 && 'Metadata'}
              {s === 3 && 'Tracks'}
              {s === 4 && 'Stores'}
              {s === 5 && 'Submit'}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div style={errorBannerStyle}>
          <Info size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Step Contents */}
      <div style={bodyStyle}>
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="glass-card" style={stepCardStyle}>
            <h3 style={stepTitleStyle}>Create New Release</h3>
            <p style={stepDescStyle}>Enter the primary information for your release draft.</p>
            
            <div className="form-group">
              <label className="form-label">Release Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Midnight Echoes"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Artist *</label>
              <input 
                type="text" 
                name="artistName"
                value={formData.artistName}
                onChange={handleChange}
                placeholder="e.g. Nova Waves"
                className="form-input"
                required
              />
            </div>

            <div style={rowStyle}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Release Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                  <option value="Single">Single (1 Track)</option>
                  <option value="EP">EP (2-5 Tracks)</option>
                  <option value="Album">Album (6+ Tracks)</option>
                  <option value="Compilation">Compilation</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Record Label (Optional)</label>
                <input 
                  type="text" 
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="e.g. Independent"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Metadata */}
        {step === 2 && (
          <div className="glass-card" style={stepCardStyle}>
            <h3 style={stepTitleStyle}>Release Metadata</h3>
            <p style={stepDescStyle}>Provide details for music streaming catalogs.</p>

            <div style={rowStyle}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Primary Genre *</label>
                <select name="primaryGenre" value={formData.primaryGenre} onChange={handleChange} className="form-select">
                  {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Secondary Genre</label>
                <select name="secondaryGenre" value={formData.secondaryGenre} onChange={handleChange} className="form-select">
                  {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div style={rowStyle}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Release Date *</label>
                <input 
                  type="date" 
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Metadata Language</label>
                <select name="language" value={formData.language} onChange={handleChange} className="form-select">
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="in">Hindi (in)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cover Artwork URL (1:1 Ratio Square, JPG/PNG)</label>
              <input 
                type="url" 
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleChange}
                placeholder="e.g. https://domain.com/artworks/cover.jpg"
                className="form-input"
              />
              <span style={inputHelpStyle}>Leave blank to use a generated default artwork in testing.</span>
            </div>
            
            <div style={rowStyle}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">C Line</label>
                <input 
                  type="text" 
                  name="cLine"
                  value={formData.cLine}
                  onChange={handleChange}
                  placeholder="e.g. 2026 Nova Waves"
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">P Line</label>
                <input 
                  type="text" 
                  name="pLine"
                  value={formData.pLine}
                  onChange={handleChange}
                  placeholder="e.g. 2026 Nova Waves Records"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Tracks */}
        {step === 3 && (
          <div className="glass-card" style={stepCardStyle}>
            <h3 style={stepTitleStyle}>Tracks Listing</h3>
            <p style={stepDescStyle}>Add and configure audio tracks for this release.</p>

            <div style={tracksContainerStyle}>
              {formData.tracks.map((track, idx) => (
                <div key={track.id} style={trackRowStyle} className="glass">
                  <div style={trackHeaderStyle}>
                    <span style={trackNumStyle}>#{idx + 1}</span>
                    <button 
                      type="button" 
                      onClick={() => removeTrack(track.id)}
                      style={deleteTrackBtnStyle}
                      disabled={formData.tracks.length <= 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={rowStyle}>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label">Track Title *</label>
                      <input 
                        type="text"
                        value={track.title}
                        onChange={(e) => handleTrackChange(track.id, 'title', e.target.value)}
                        placeholder="Song Title"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Version</label>
                      <input 
                        type="text"
                        value={track.version}
                        onChange={(e) => handleTrackChange(track.id, 'version', e.target.value)}
                        placeholder="e.g. Extended Mix"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={rowStyle}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">ISRC (Optional)</label>
                      <input 
                        type="text"
                        value={track.isrc}
                        onChange={(e) => handleTrackChange(track.id, 'isrc', e.target.value)}
                        placeholder="e.g. USABC1234567"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">ISWC (Optional)</label>
                      <input 
                        type="text"
                        value={track.iswc}
                        onChange={(e) => handleTrackChange(track.id, 'iswc', e.target.value)}
                        placeholder="e.g. T0345246801"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                      <label style={checkboxLabelStyle}>
                        <input 
                          type="checkbox"
                          checked={track.explicit}
                          onChange={(e) => handleTrackChange(track.id, 'explicit', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        Explicit Content
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addTrack} className="btn btn-secondary" style={addTrackBtnStyle}>
              <Plus size={16} />
              <span>Add Another Track</span>
            </button>
          </div>
        )}

        {/* STEP 4: Store Delivery */}
        {step === 4 && (
          <div className="glass-card" style={stepCardStyle}>
            <h3 style={stepTitleStyle}>Select Distribution Platforms</h3>
            <p style={stepDescStyle}>Choose which stores and streaming platforms you want to deliver to.</p>

            <div style={platformsGridStyle}>
              {allPlatforms.map(platform => {
                const isChecked = formData.platforms.includes(platform);
                return (
                  <label key={platform} style={platformCardStyle(isChecked)}>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(platform)}
                      style={hiddenCheckboxStyle}
                    />
                    <Globe size={18} style={{ color: isChecked ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                    <span style={{ fontWeight: isChecked ? '700' : '500' }}>{platform}</span>
                    <div style={checkboxIndicatorStyle(isChecked)}>
                      {isChecked && <Check size={10} style={{ color: '#000' }} />}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label className="form-label">Delivery Territories</label>
              <select name="territories" className="form-select" defaultValue="Worldwide">
                <option value="Worldwide">Worldwide (All Territories)</option>
                <option value="Custom">Custom / Limited (North America, Europe)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (
          <div className="glass-card" style={stepCardStyle}>
            <h3 style={stepTitleStyle}>Final Review</h3>
            <p style={stepDescStyle}>Please verify your release details before submitting to Too Lost review.</p>

            <div style={reviewContainerStyle} className="glass">
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Release Title:</span>
                <span style={reviewValueStyle}>{formData.title}</span>
              </div>
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Primary Artist:</span>
                <span style={reviewValueStyle}>{formData.artistName}</span>
              </div>
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Type:</span>
                <span style={reviewValueStyle}>{formData.type}</span>
              </div>
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Genre:</span>
                <span style={reviewValueStyle}>{formData.primaryGenre} / {formData.secondaryGenre}</span>
              </div>
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Release Date:</span>
                <span style={reviewValueStyle}>{formData.releaseDate}</span>
              </div>
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Tracks Count:</span>
                <span style={reviewValueStyle}>{formData.tracks.length} track(s)</span>
              </div>
              <div style={reviewRowStyle}>
                <span style={reviewLabelStyle}>Deliver To:</span>
                <span style={reviewValueStyle}>{formData.platforms.join(', ')}</span>
              </div>
            </div>

            <div style={termsBoxStyle}>
              <p style={termsTextStyle}>
                By submitting this release, you certify that you own or control all necessary rights in and to the recordings and compositions. You agree to the Too Lost distribution terms of service.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div style={footerBtnContainerStyle}>
        {step > 1 ? (
          <button onClick={prevStep} className="btn btn-secondary" disabled={loading}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button onClick={nextStep} className="btn btn-primary">
            <span>Next Step</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-primary" disabled={loading} style={{ background: 'var(--color-accent-gradient)' }}>
            {loading ? (
              <span>Submitting to Too Lost...</span>
            ) : (
              <>
                <Check size={16} />
                <span>Submit Release</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: '750px',
  margin: '0 auto',
};

const stepHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2.5rem',
  background: 'rgba(255, 255, 255, 0.02)',
  padding: '1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const stepIndicatorStyle = (s, step) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  flex: 1,
  opacity: s <= step ? 1 : 0.4,
});

const stepCircleStyle = (s, step) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: s < step ? 'var(--color-primary)' : s === step ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
  color: s <= step ? '#000' : 'var(--text-secondary)',
  fontWeight: '700',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: s === step ? '0 0 10px rgba(0,255,135,0.3)' : 'none',
  transition: 'all 0.3s ease',
});

const stepLabelStyle = (s, step) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: s === step ? '#fff' : 'var(--text-secondary)',
});

const errorBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  background: 'rgba(239, 68, 68, 0.1)',
  color: 'var(--danger)',
  padding: '1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
};

const bodyStyle = {
  marginBottom: '2rem',
};

const stepCardStyle = {
  padding: '2rem',
};

const stepTitleStyle = {
  fontSize: '1.5rem',
  color: '#fff',
  marginBottom: '0.5rem',
};

const stepDescStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  marginBottom: '1.75rem',
};

const rowStyle = {
  display: 'flex',
  gap: '1rem',
};

const inputHelpStyle = {
  display: 'block',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginTop: '4px',
};

const tracksContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const trackRowStyle = {
  padding: '1.25rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const trackHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const trackNumStyle = {
  fontFamily: 'var(--font-outfit)',
  fontWeight: '800',
  color: 'var(--color-primary)',
};

const deleteTrackBtnStyle = {
  background: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  color: 'var(--danger)',
  borderRadius: 'var(--radius-sm)',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

const checkboxLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const addTrackBtnStyle = {
  width: '100%',
  borderStyle: 'dashed',
  borderColor: 'var(--border-color-hover)',
  background: 'transparent',
  color: 'var(--text-secondary)',
};

const platformsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '1rem',
};

const platformCardStyle = (isChecked) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '1rem',
  borderRadius: 'var(--radius-md)',
  border: isChecked ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
  background: isChecked ? 'rgba(0, 255, 135, 0.02)' : 'rgba(255, 255, 255, 0.01)',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.2s ease',
});

const hiddenCheckboxStyle = {
  position: 'absolute',
  opacity: 0,
  cursor: 'pointer',
  height: 0,
  width: 0,
};

const checkboxIndicatorStyle = (isChecked) => ({
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  border: isChecked ? '1px solid var(--color-primary)' : '1px solid var(--text-muted)',
  background: isChecked ? 'var(--color-primary)' : 'transparent',
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const reviewContainerStyle = {
  padding: '1.5rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginBottom: '1.5rem',
};

const reviewRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
};

const reviewLabelStyle = {
  color: 'var(--text-secondary)',
  fontWeight: '600',
};

const reviewValueStyle = {
  color: '#fff',
  fontWeight: '700',
};

const termsBoxStyle = {
  background: 'rgba(255,255,255,0.02)',
  padding: '1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const termsTextStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5',
};

const footerBtnContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '2rem',
};
