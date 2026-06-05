import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleCallback } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(searchParams.get('error_description') || errorParam);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    (async () => {
      try {
        await handleCallback(code, state);
        await refetchUser();
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Authentication failed');
      }
    })();
  }, [searchParams, navigate, refetchUser]);

  if (error) {
    return (
      <div className="login-page">
        <div className="login-bg">
          <div className="login-bg-orb login-bg-orb-1" />
          <div className="login-bg-orb login-bg-orb-2" />
        </div>
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-lg)',
            background: 'rgba(251, 113, 133, 0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--rose)',
          }}>
            <AlertCircle size={30} />
          </div>
          <h2 style={{ marginBottom: 8 }}>Authentication Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/', { replace: true })}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
      </div>
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ marginBottom: 8 }}>Authenticating...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Completing sign-in with Too Lost</p>
      </div>
    </div>
  );
}
