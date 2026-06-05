import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LogIn, UserPlus, Music2, Disc3, BarChart3, Shield } from 'lucide-react';

export default function Login() {
  const { authenticated, loading, login, register } = useAuth();

  if (loading) {
    return (
      <div className="login-page">
        <div className="spinner" />
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <Music2 size={30} />
        </div>
        <h1 className="login-title">Too Lost</h1>
        <p className="login-subtitle">
          Music distribution dashboard — manage releases, track analytics, and monitor sales.
        </p>

        <div className="login-actions">
          <button className="btn btn-primary btn-lg" onClick={login} id="login-btn">
            <LogIn size={20} />
            Sign in with Too Lost
          </button>
          <button className="btn btn-secondary btn-lg" onClick={register} id="register-btn">
            <UserPlus size={20} />
            Create Account
          </button>
          <div className="login-separator">or explore without an account</div>
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={() => {
              localStorage.setItem('tl_mock_mode', 'true');
              localStorage.setItem('tl_access_token', 'mock_token');
              localStorage.setItem('tl_expires_at', (Date.now() + 3600000).toString());
              window.location.reload();
            }} 
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: 'var(--text-primary)'
            }}
          >
            <Music2 size={20} style={{ color: 'var(--brand-accent)' }} />
            Explore Demo Mode
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 36 }}>
          {[
            { icon: Disc3, label: 'Releases' },
            { icon: BarChart3, label: 'Analytics' },
            { icon: Shield, label: 'Secure OAuth' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{
              padding: '14px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}>
              <Icon size={20} style={{ color: 'var(--brand-accent)', marginBottom: 6 }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{label}</div>
            </div>
          ))}
        </div>

        <p className="login-footer">
          Powered by <strong style={{ color: 'var(--brand-accent)' }}>Too Lost API</strong> · OAuth 2.0 PKCE
        </p>
      </div>
    </div>
  );
}
