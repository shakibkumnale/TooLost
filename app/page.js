'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Music, Globe, BarChart3, Shield, ArrowRight, Disc, AlertTriangle } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div style={containerStyle}>
      {/* Background decoration */}
      <div style={glowBgStyle} />
      <div style={glowBg2Style} />

      <main style={mainStyle}>
        {/* Navbar */}
        <header style={headerStyle}>
          <div style={logoStyle}>
            <Disc size={28} style={{ color: 'var(--color-primary)' }} />
            <span style={logoTextStyle}>WAVE<span style={{ color: 'var(--color-primary)' }}>VAULT</span></span>
          </div>
          <a href="https://toolost.com" target="_blank" rel="noreferrer" style={navLinkStyle}>
            Powered by Too Lost
          </a>
        </header>

        {/* Hero Section */}
        <section style={heroStyle}>
          <span style={pillStyle}>✦ PREMIUM MUSIC DISTRIBUTION</span>
          <h1 style={titleStyle}>
            Distribute Your Music <br />
            <span className="text-gradient">Worldwide in Clicks.</span>
          </h1>
          <p style={subtitleStyle}>
            Connect your Too Lost account to deliver singles, albums, and videos to Spotify, Apple Music, TikTok, and 150+ stores instantly. Track streams and collect 100% of your earnings.
          </p>

          {error && (
            <div style={errorStyle}>
              <AlertTriangle size={18} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: '700' }}>Authentication Error</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{decodeURIComponent(error)}</span>
              </div>
            </div>
          )}

          <div style={ctaContainerStyle}>
            <a href="/api/auth/login" id="connect-btn" className="btn btn-primary" style={ctaButtonStyle}>
              <span>Connect with Too Lost</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Stats row */}
          <div style={statsRowStyle}>
            <div style={statItemStyle}>
              <span style={statValueStyle}>150+</span>
              <span style={statLabelStyle}>DSP Stores</span>
            </div>
            <div style={statDividerStyle} />
            <div style={statItemStyle}>
              <span style={statValueStyle}>100%</span>
              <span style={statLabelStyle}>Rights Retained</span>
            </div>
            <div style={statDividerStyle} />
            <div style={statItemStyle}>
              <span style={statValueStyle}>Real-time</span>
              <span style={statLabelStyle}>Analytics</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section style={featuresSectionStyle}>
          <h2 style={sectionTitleStyle}>Everything You Need to <span className="text-gradient">Grow</span></h2>
          <div style={gridStyle}>
            <div className="glass-card" style={featureCardStyle}>
              <div style={{ ...iconWrapperStyle, background: 'rgba(0, 255, 135, 0.06)', borderColor: 'rgba(0, 255, 135, 0.15)' }}>
                <Globe size={22} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 style={featureTitleStyle}>Global Reach</h3>
              <p style={featureDescStyle}>
                Publish your catalogue to all major DSPs including Apple Music, Amazon, Spotify, Deezer, and YouTube Music worldwide.
              </p>
            </div>

            <div className="glass-card" style={featureCardStyle}>
              <div style={{ ...iconWrapperStyle, background: 'rgba(0, 240, 255, 0.06)', borderColor: 'rgba(0, 240, 255, 0.15)' }}>
                <BarChart3 size={22} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 style={featureTitleStyle}>Real-time Analytics</h3>
              <p style={featureDescStyle}>
                Analyze streaming activities, popular tracks, listener territories, and platform breakdown directly from your dashboard.
              </p>
            </div>

            <div className="glass-card" style={featureCardStyle}>
              <div style={{ ...iconWrapperStyle, background: 'rgba(139, 92, 246, 0.06)', borderColor: 'rgba(139, 92, 246, 0.15)' }}>
                <Shield size={22} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h3 style={featureTitleStyle}>Rights & Control</h3>
              <p style={featureDescStyle}>
                Keep 100% ownership of your rights. Manage participants, labels, and ISRCs with full validation and transparency.
              </p>
            </div>

            <div className="glass-card" style={featureCardStyle}>
              <div style={{ ...iconWrapperStyle, background: 'rgba(245, 158, 11, 0.06)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
                <Music size={22} style={{ color: 'var(--warning)' }} />
              </div>
              <h3 style={featureTitleStyle}>Release Management</h3>
              <p style={featureDescStyle}>
                Multi-step release wizard for singles, EPs, albums, and music videos with track-level ISRC management.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={footerStyle}>
        <span>© {new Date().getFullYear()} WaveVault Distribution. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#030304', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(0,255,135,0.2)', borderTopColor: '#00ff87', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

const containerStyle = {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#030304',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
};

const glowBgStyle = {
  position: 'absolute',
  top: '-10%',
  left: '10%',
  width: '80%',
  height: '60%',
  background: 'radial-gradient(ellipse at center, rgba(0, 255, 135, 0.07) 0%, rgba(139, 92, 246, 0.03) 50%, transparent 100%)',
  zIndex: 1,
  pointerEvents: 'none',
};

const glowBg2Style = {
  position: 'absolute',
  bottom: '10%',
  right: '-10%',
  width: '50%',
  height: '40%',
  background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.05) 0%, transparent 70%)',
  zIndex: 1,
  pointerEvents: 'none',
};

const mainStyle = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
};

const headerStyle = {
  height: '90px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const logoTextStyle = {
  fontFamily: 'var(--font-outfit)',
  fontSize: '1.5rem',
  fontWeight: '800',
  letterSpacing: '-0.03em',
};

const navLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: '500',
};

const heroStyle = {
  padding: '7rem 0 4rem 0',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '820px',
  margin: '0 auto',
};

const pillStyle = {
  background: 'rgba(0, 255, 135, 0.06)',
  color: 'var(--color-primary)',
  border: '1px solid rgba(0, 255, 135, 0.15)',
  padding: '0.4rem 1.25rem',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.72rem',
  fontWeight: '700',
  letterSpacing: '0.1em',
  marginBottom: '2.25rem',
  display: 'inline-block',
};

const titleStyle = {
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  lineHeight: '1.1',
  fontWeight: '800',
  letterSpacing: '-0.04em',
  marginBottom: '1.5rem',
};

const subtitleStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.7',
  color: 'var(--text-secondary)',
  marginBottom: '2.5rem',
  fontWeight: '400',
  maxWidth: '620px',
};

const errorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  background: 'rgba(239, 68, 68, 0.08)',
  color: 'var(--danger)',
  padding: '1rem 1.5rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  marginBottom: '2rem',
  textAlign: 'left',
  maxWidth: '500px',
  width: '100%',
};

const ctaContainerStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '3rem',
};

const ctaButtonStyle = {
  padding: '1rem 2.25rem',
  fontSize: '1rem',
  boxShadow: '0 0 40px rgba(0, 255, 135, 0.25)',
  textDecoration: 'none',
};

const statsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  padding: '1.5rem 2.5rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 'var(--radius-lg)',
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
};

const statValueStyle = {
  fontFamily: 'var(--font-outfit)',
  fontSize: '1.5rem',
  fontWeight: '800',
  color: '#fff',
};

const statLabelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
};

const statDividerStyle = {
  width: '1px',
  height: '40px',
  background: 'rgba(255,255,255,0.06)',
};

const featuresSectionStyle = {
  padding: '5rem 0 6rem 0',
};

const sectionTitleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  textAlign: 'center',
  marginBottom: '3rem',
  letterSpacing: '-0.03em',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.25rem',
};

const featureCardStyle = {
  padding: '2rem',
  textAlign: 'left',
};

const iconWrapperStyle = {
  width: '46px',
  height: '46px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem',
};

const featureTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
  marginBottom: '0.6rem',
  fontWeight: '700',
};

const featureDescStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.7',
};

const footerStyle = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  padding: '2rem 0',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  borderTop: '1px solid rgba(255,255,255,0.03)',
};
