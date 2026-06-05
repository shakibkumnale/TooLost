import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listReleases, getAnalyticsOverview, listMonthlyOverview } from '../lib/endpoints';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ChartCard from '../components/ChartCard';
import { PageHeader } from '../components/UI';
import { Disc3, Music2, Radio, DollarSign, Plus, ArrowRight, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PLACEHOLDER_CHART = [
  { month: 'Jan', streams: 4200 }, { month: 'Feb', streams: 5800 },
  { month: 'Mar', streams: 4900 }, { month: 'Apr', streams: 7200 },
  { month: 'May', streams: 6800 }, { month: 'Jun', streams: 8500 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [releases, setReleases] = useState([]);
  const [stats, setStats] = useState({ total: 0, live: 0, draft: 0, tracks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listReleases({ perPage: 5, page: 1 });
        const data = res.data || [];
        setReleases(data);

        const allRes = await listReleases({ perPage: 1, page: 1 });
        const totalItems = allRes.totalItems || data.length;
        const liveCount = data.filter(r => r.status === 'live').length;
        const draftCount = data.filter(r => r.status === 'draft').length;
        const trackCount = data.reduce((sum, r) => sum + (r.tracks?.length || 0), 0);

        setStats({ total: totalItems, live: liveCount, draft: draftCount, tracks: trackCount });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={`${greeting}, ${user?.first_name || 'there'} 👋`}
        subtitle="Here's what's happening with your music today."
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/releases/new')}>
            <Plus size={18} /> New Release
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-4 stagger" style={{ marginBottom: 28 }}>
        <StatsCard
          icon={Disc3}
          label="Total Releases"
          value={stats.total}
          color="var(--brand-primary)"
        />
        <StatsCard
          icon={Radio}
          label="Live Releases"
          value={stats.live}
          color="var(--emerald)"
        />
        <StatsCard
          icon={Music2}
          label="Draft Releases"
          value={stats.draft}
          color="var(--amber)"
        />
        <StatsCard
          icon={DollarSign}
          label="Total Tracks"
          value={stats.tracks}
          color="var(--cyan)"
        />
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        {/* Streams Chart */}
        <ChartCard title="Streams Overview" action={
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/analytics')}>
            View All <ArrowRight size={14} />
          </button>
        }>
          <AreaChart data={PLACEHOLDER_CHART}>
            <defs>
              <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#161b2e',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#a78bfa' }}
            />
            <Area type="monotone" dataKey="streams" stroke="#6366f1" strokeWidth={2} fill="url(#streamGrad)" />
          </AreaChart>
        </ChartCard>

        {/* Recent Releases */}
        <div className="card">
          <div className="card-header">
            <h4 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Recent Releases</h4>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/releases')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 24 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
                ))}
              </div>
            ) : releases.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Disc3 size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p>No releases yet</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/releases/new')}>
                  <Plus size={16} /> Create First Release
                </button>
              </div>
            ) : (
              <div>
                {releases.map((release) => (
                  <div
                    key={release.id}
                    onClick={() => navigate(`/releases/${release.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 24px', cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0,
                    }}>
                      {release.compressedArtwork || release.coverUrl ? (
                        <img src={release.compressedArtwork || release.coverUrl} alt={release.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <Disc3 size={18} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {release.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{release.type}</span>
                        {release.releaseDate && (
                          <>
                            <span>·</span>
                            <Calendar size={10} />
                            <span>{release.releaseDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={release.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-3">
        {[
          { icon: Plus, label: 'Create Release', desc: 'Start a new draft release', to: '/releases/new', color: 'var(--brand-primary)' },
          { icon: TrendingUp, label: 'View Analytics', desc: 'Track performance & streams', to: '/analytics', color: 'var(--cyan)' },
          { icon: DollarSign, label: 'Sales Report', desc: 'Revenue & earning details', to: '/sales', color: 'var(--emerald)' },
        ].map(({ icon: Icon, label, desc, to, color }) => (
          <div
            key={to}
            className="card"
            onClick={() => navigate(to)}
            style={{ cursor: 'pointer', padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: `${color}18`, color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{desc}</div>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
