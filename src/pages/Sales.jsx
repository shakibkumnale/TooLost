import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { listMonthlyOverview } from '../lib/endpoints';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import { PageHeader } from '../components/UI';
import { DollarSign, TrendingUp, BarChart3, Music2, Disc3, Users, Globe, Radio } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

const SAMPLE_MONTHLY = [
  { month: 'Jan', revenue: 245, streams: 12400 },
  { month: 'Feb', revenue: 312, streams: 18200 },
  { month: 'Mar', revenue: 289, streams: 15800 },
  { month: 'Apr', revenue: 421, streams: 22100 },
  { month: 'May', revenue: 387, streams: 19600 },
  { month: 'Jun', revenue: 498, streams: 25400 },
];

const SALES_TABS = [
  { path: '/sales', label: 'Overview' },
  { path: '/sales/tracks', label: 'Tracks' },
  { path: '/sales/releases', label: 'Releases' },
  { path: '/sales/artists', label: 'Artists' },
  { path: '/sales/channels', label: 'Channels' },
  { path: '/sales/territories', label: 'Territories' },
  { path: '/sales/stream-rates', label: 'Stream Rates' },
];

export default function Sales() {
  const navigate = useNavigate();
  const location = useLocation();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOverview = location.pathname === '/sales';

  useEffect(() => {
    if (!isOverview) return;
    async function load() {
      try {
        const res = await listMonthlyOverview();
        setOverview(res.data || res);
      } catch { /* use sample */ }
      finally { setLoading(false); }
    }
    load();
  }, [isOverview]);

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Sales" subtitle="Revenue, earnings, and royalty data" />

      {/* Sub-navigation tabs */}
      <div className="tabs">
        {SALES_TABS.map(tab => (
          <button
            key={tab.path}
            className={`tab ${location.pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isOverview ? (
        <>
          {/* Stats */}
          <div className="grid grid-4 stagger" style={{ marginBottom: 28 }}>
            <StatsCard icon={DollarSign} label="Total Revenue" value={2152} prefix="$" color="var(--emerald)" change={8.3} />
            <StatsCard icon={TrendingUp} label="This Month" value={498} prefix="$" color="var(--brand-primary)" change={12.1} />
            <StatsCard icon={BarChart3} label="Avg Per Stream" value="$0.0038" color="var(--cyan)" />
            <StatsCard icon={Music2} label="Earning Tracks" value={24} color="var(--amber)" />
          </div>

          {/* Charts */}
          <div className="grid grid-2" style={{ marginBottom: 28 }}>
            <ChartCard title="Monthly Revenue" height={280}>
              <BarChart data={overview?.monthly || SAMPLE_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}
                  labelStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="revenue" fill="#34d399" radius={[6, 6, 0, 0]} barSize={32} name="Revenue ($)" />
              </BarChart>
            </ChartCard>

            <ChartCard title="Streams Trend" height={280}>
              <LineChart data={overview?.monthly || SAMPLE_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}
                  labelStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="streams" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Streams" />
              </LineChart>
            </ChartCard>
          </div>

          {/* Quick Links */}
          <div className="grid grid-3">
            {[
              { icon: Music2, label: 'Track Sales', desc: 'Per-track revenue breakdown', path: '/sales/tracks' },
              { icon: Disc3, label: 'Release Sales', desc: 'Revenue by release', path: '/sales/releases' },
              { icon: Globe, label: 'Territories', desc: 'Geographic revenue split', path: '/sales/territories' },
            ].map(item => (
              <div key={item.path} className="card" onClick={() => navigate(item.path)}
                style={{ cursor: 'pointer', padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: 'rgba(52, 211, 153, 0.12)', color: 'var(--emerald)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <item.icon size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
