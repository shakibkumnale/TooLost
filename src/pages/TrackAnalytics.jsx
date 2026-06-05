import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrackAnalytics, getTrackCharts } from '../lib/endpoints';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import { PageHeader, LoadingSpinner } from '../components/UI';
import { ArrowLeft, Headphones, TrendingUp, Users, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SAMPLE_DATA = [
  { date: 'Week 1', streams: 1200 }, { date: 'Week 2', streams: 1800 },
  { date: 'Week 3', streams: 1500 }, { date: 'Week 4', streams: 2200 },
  { date: 'Week 5', streams: 2800 }, { date: 'Week 6', streams: 2400 },
];

export default function TrackAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [trackRes, chartRes] = await Promise.allSettled([
          getTrackAnalytics(id),
          getTrackCharts(id),
        ]);
        if (trackRes.status === 'fulfilled') setTrack(trackRes.value.data || trackRes.value);
        if (chartRes.status === 'fulfilled') setCharts(chartRes.value.data || chartRes.value);
      } catch { /* use sample */ }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading track analytics..." />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={track?.title || `Track #${id}`}
        subtitle="Detailed streaming analytics"
        actions={
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/analytics')}>
            <ArrowLeft size={16} /> Back to Analytics
          </button>
        }
      />

      <div className="grid grid-4 stagger" style={{ marginBottom: 28 }}>
        <StatsCard icon={Headphones} label="Total Streams" value={track?.totalStreams || 12000} color="var(--brand-primary)" />
        <StatsCard icon={TrendingUp} label="This Month" value={track?.monthStreams || 2800} color="var(--emerald)" change={15.2} />
        <StatsCard icon={Users} label="Listeners" value={track?.listeners || 3200} color="var(--cyan)" />
        <StatsCard icon={Globe} label="Countries" value={track?.countries || 14} color="var(--amber)" />
      </div>

      <ChartCard title="Streams Over Time" height={320}>
        <AreaChart data={charts?.history || SAMPLE_DATA}>
          <defs>
            <linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}
            labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#a78bfa' }} />
          <Area type="monotone" dataKey="streams" stroke="#8b5cf6" strokeWidth={2} fill="url(#trackGrad)" />
        </AreaChart>
      </ChartCard>
    </div>
  );
}
