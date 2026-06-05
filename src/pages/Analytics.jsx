import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsOverview, listAnalyticsTracks, listAnalyticsPlatforms } from '../lib/endpoints';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import { PageHeader } from '../components/UI';
import { BarChart3, TrendingUp, Users, Headphones, Music2, ExternalLink } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];

const SAMPLE_STREAMS = [
  { date: 'Jan', streams: 12400 }, { date: 'Feb', streams: 18200 },
  { date: 'Mar', streams: 15800 }, { date: 'Apr', streams: 22100 },
  { date: 'May', streams: 28600 }, { date: 'Jun', streams: 25400 },
];

const SAMPLE_PLATFORMS = [
  { name: 'Spotify', value: 42 }, { name: 'Apple Music', value: 28 },
  { name: 'YouTube Music', value: 15 }, { name: 'Amazon', value: 8 },
  { name: 'Other', value: 7 },
];

const SAMPLE_TRACKS = [
  { name: 'Midnight Echoes', streams: 8400 },
  { name: 'Neon Dreams', streams: 6200 },
  { name: 'After Hours', streams: 5100 },
  { name: 'Crystal Waves', streams: 3800 },
  { name: 'Void Walker', streams: 2900 },
];

export default function Analytics() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAnalyticsOverview();
        setOverview(res.data || res);
      } catch {
        // Use sample data if API not available
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Analytics"
        subtitle="Track your streaming performance and audience insights"
      />

      {/* Stats */}
      <div className="grid grid-4 stagger" style={{ marginBottom: 28 }}>
        <StatsCard icon={Headphones} label="Total Streams" value={overview?.totalStreams || 122500} color="var(--brand-primary)" change={12.4} />
        <StatsCard icon={Users} label="Monthly Listeners" value={overview?.monthlyListeners || 8430} color="var(--cyan)" change={5.2} />
        <StatsCard icon={TrendingUp} label="Avg Daily Streams" value={overview?.avgDaily || 4083} color="var(--emerald)" change={-2.1} />
        <StatsCard icon={Music2} label="Top Tracks" value={overview?.topTracks || 24} color="var(--amber)" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        {/* Streams Over Time */}
        <ChartCard title="Streams Over Time" height={280}>
          <AreaChart data={overview?.streamHistory || SAMPLE_STREAMS}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}
              labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#a78bfa' }} />
            <Area type="monotone" dataKey="streams" stroke="#6366f1" strokeWidth={2} fill="url(#analyticsGrad)" />
          </AreaChart>
        </ChartCard>

        {/* Platform Distribution */}
        <ChartCard title="Platform Distribution" height={280}>
          <PieChart>
            <Pie data={overview?.platforms || SAMPLE_PLATFORMS} dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
              {(overview?.platforms || SAMPLE_PLATFORMS).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}
              labelStyle={{ color: '#94a3b8' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          </PieChart>
        </ChartCard>
      </div>

      {/* Top Tracks */}
      <ChartCard title="Top Tracks by Streams" height={280}>
        <BarChart data={overview?.topTracksList || SAMPLE_TRACKS} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
          <Tooltip contentStyle={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}
            labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#a78bfa' }} />
          <Bar dataKey="streams" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
        </BarChart>
      </ChartCard>
    </div>
  );
}
