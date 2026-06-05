import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/UI';
import { User, Mail, Calendar, Shield, Key, Globe, Clock } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const sections = [
    {
      title: 'Profile Information',
      icon: User,
      fields: [
        { icon: User, label: 'Name', value: `${user.first_name} ${user.last_name}` },
        { icon: Mail, label: 'Email', value: user.email },
        { icon: Globe, label: 'Username', value: `@${user.username}` },
        { icon: Shield, label: 'Account Type', value: user.type, capitalize: true },
        { icon: Calendar, label: 'Member Since', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
      ],
    },
    {
      title: 'OAuth Connection',
      icon: Key,
      fields: [
        { icon: Key, label: 'Client ID', value: import.meta.env.VITE_CLIENT_ID, mono: true },
        { icon: Globe, label: 'API Base', value: import.meta.env.VITE_API_BASE_URL, mono: true },
        { icon: Shield, label: 'Auth URL', value: import.meta.env.VITE_AUTH_URL, mono: true },
        { icon: Clock, label: 'Token Lifetime', value: '15 days (access) / 30 days (refresh)' },
        {
          icon: Shield, label: 'Scopes',
          value: import.meta.env.VITE_SCOPES?.split(' ').join(', '),
        },
      ],
    },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Settings"
        subtitle="Your profile and connection details"
        actions={
          <button className="btn btn-danger btn-sm" onClick={logout}>
            Sign Out
          </button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* User Avatar Card */}
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 'var(--radius-full)',
              background: 'var(--brand-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: 'white',
              boxShadow: 'var(--shadow-glow-lg)', overflow: 'hidden', flexShrink: 0,
            }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase()
              )}
            </div>
            <div>
              <h2 style={{ marginBottom: 4 }}>{user.first_name} {user.last_name}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{user.email}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-live" style={{ textTransform: 'capitalize' }}>{user.type}</span>
                {user.confirmed && (
                  <span className="badge" style={{ color: 'var(--cyan)', background: 'rgba(34,211,238,0.12)' }}>
                    <Shield size={10} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Sections */}
        {sections.map((section) => (
          <div key={section.title} className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <section.icon size={18} style={{ color: 'var(--brand-accent)' }} />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{section.title}</h4>
              </div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {section.fields.map((field) => (
                <div key={field.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <field.icon size={16} style={{ color: 'var(--text-tertiary)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      {field.label}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontFamily: field.mono ? "'JetBrains Mono', monospace" : 'inherit',
                      textTransform: field.capitalize ? 'capitalize' : 'none',
                      wordBreak: 'break-all',
                    }}>
                      {field.value || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="card" style={{ borderColor: 'rgba(251,113,133,0.2)' }}>
          <div className="card-header">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--rose)' }}>Danger Zone</h4>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Sign Out</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Clear your session and return to the login screen.
              </p>
            </div>
            <button className="btn btn-danger" onClick={logout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
