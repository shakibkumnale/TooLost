'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StreamsChart from '@/components/charts/StreamsChart';
import PlatformChart from '@/components/charts/PlatformChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatCard from '@/components/ui/StatCard';
import { Play, TrendingUp, Music, Globe, Eye } from 'lucide-react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalStreams: 0,
    monthlyListeners: 0,
    savedTracks: 0,
    topTracks: [],
    platformStreams: [],
    monthlyHistory: []
  });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        // Fetch track analytics and platforms analytics parallelly
        const [overviewRes, tracksRes, platformsRes] = await Promise.all([
          fetch('/api/analytics?endpoint=overview'),
          fetch('/api/analytics?endpoint=tracks'),
          fetch('/api/analytics?endpoint=platforms')
        ]);

        let overview = { total_streams: 142800, monthly_listeners: 31200, saved_tracks: 8400 };
        let tracksList = [
          { title: 'Track One (Extended Mix)', streams: 42300, percentage: 30 },
          { title: 'Neon Nights (Radio Edit)', streams: 38200, percentage: 27 },
          { title: 'Midnight Echoes', streams: 25400, percentage: 18 },
          { title: 'Ocean Waves', streams: 19100, percentage: 13 },
          { title: 'Stardust', streams: 17800, percentage: 12 }
        ];
        let platformsList = [
          { name: 'Spotify', value: 64260 },
          { name: 'Apple Music', value: 39984 },
          { name: 'YouTube Music', value: 21420 },
          { name: 'Deezer', value: 7140 },
          { name: 'Amazon Music', value: 9996 }
        ];

        if (overviewRes.ok) {
          const overviewData = await overviewRes.json();
          if (overviewData.data) {
            overview = overviewData.data;
          }
        }
        if (tracksRes.ok) {
          const tracksData = await tracksRes.json();
          if (tracksData.data && tracksData.data.length > 0) {
            tracksList = tracksData.data;
          }
        }
        if (platformsRes.ok) {
          const platformsData = await platformsRes.json();
          if (platformsData.data && platformsData.data.length > 0) {
            platformsList = platformsData.data;
          }
        }

        setAnalyticsData({
          totalStreams: overview.total_streams,
          monthlyListeners: overview.monthly_listeners,
          savedTracks: overview.saved_tracks,
          topTracks: tracksList,
          platformStreams: platformsList,
          monthlyHistory: [
            { name: 'Jan', streams: Math.floor(overview.total_streams * 0.12) },
            { name: 'Feb', streams: Math.floor(overview.total_streams * 0.16) },
            { name: 'Mar', streams: Math.floor(overview.total_streams * 0.22) },
            { name: 'Apr', streams: Math.floor(overview.total_streams * 0.28) },
            { name: 'May', streams: Math.floor(overview.total_streams * 0.44) },
            { name: 'Jun', streams: Math.floor(overview.total_streams * 0.65) },
            { name: 'Jul', streams: overview.total_streams }
          ]
        });

      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={loadingContainerStyle}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading analytics dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        
        {/* Header */}
        <div>
          <h2 style={titleStyle}>Streaming Analytics</h2>
          <p style={descStyle}>Get insights into streams, listeners, platforms and tracks performance.</p>
        </div>

        {/* Overview Stats */}
        <div style={statsRowStyle}>
          <StatCard 
            title="Total Streams" 
            value={analyticsData.totalStreams.toLocaleString()} 
            icon={Play} 
            description="Total plays across all distributed stores" 
            trend="+15.3%"
            trendType="up"
          />
          <StatCard 
            title="Monthly Listeners" 
            value={analyticsData.monthlyListeners.toLocaleString()} 
            icon={TrendingUp} 
            description="Average active monthly listeners" 
            trend="+9.2%"
            trendType="up"
          />
          <StatCard 
            title="Track Saves" 
            value={analyticsData.savedTracks.toLocaleString()} 
            icon={Music} 
            description="Users saving tracks to their library" 
            trend="+24%"
            trendType="up"
          />
        </div>

        {/* Charts Row */}
        <div style={chartsRowStyle}>
          <div className="glass-card" style={chartCardStyle}>
            <h4 style={chartTitleStyle}>Streams History</h4>
            <span style={chartSubtitleStyle}>Lifetime playback trajectory (Monthly streams count)</span>
            <div style={{ marginTop: '1rem' }}>
              <StreamsChart data={analyticsData.monthlyHistory} />
            </div>
          </div>

          <div className="glass-card" style={chartCardStyle}>
            <h4 style={chartTitleStyle}>Share by Platform</h4>
            <span style={chartSubtitleStyle}>Listener distribution share</span>
            <div style={{ marginTop: '1.5rem' }}>
              <PlatformChart data={analyticsData.platformStreams} />
            </div>
          </div>
        </div>

        {/* Top Performing Tracks */}
        <div className="glass-card" style={tracksCardStyle}>
          <h4 style={panelTitleStyle}>Top Performing Tracks</h4>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Track Name</th>
                  <th>Total Plays</th>
                  <th>Share Rate</th>
                  <th>Trend Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topTracks.map((track, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: '600', color: '#fff' }}>{track.title}</td>
                    <td>{track.streams.toLocaleString()}</td>
                    <td>
                      <div style={progressContainerStyle}>
                        <div style={progressBarActiveStyle(track.percentage)} />
                        <span style={progressTextStyle}>{track.percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={trendBadgeStyle}>Trending Up</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60vh',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '800',
  color: '#fff',
};

const descStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  marginTop: '4px',
};

const statsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
};

const chartsRowStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '1.5rem',
};

const chartCardStyle = {
  padding: '1.5rem',
};

const chartTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
};

const chartSubtitleStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
};

const tracksCardStyle = {
  padding: '1.5rem',
};

const panelTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
  marginBottom: '1rem',
};

const progressContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  maxWidth: '180px',
};

const progressBarActiveStyle = (percentage) => ({
  height: '6px',
  width: `${percentage}%`,
  background: 'var(--color-accent-gradient)',
  borderRadius: '3px',
});

const progressTextStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: 'var(--text-secondary)',
};

const trendBadgeStyle = {
  padding: '0.15rem 0.5rem',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.7rem',
  fontWeight: '700',
  color: 'var(--success)',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
};
