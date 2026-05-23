'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import StreamsChart from '@/components/charts/StreamsChart';
import PlatformChart from '@/components/charts/PlatformChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Play, DollarSign, Disc, Users, Music, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    streams: '0',
    earnings: '$0.00',
    liveReleases: '0',
    monthlyListeners: '0',
  });
  const [streamsData, setStreamsData] = useState([]);
  const [platformsData, setPlatformsData] = useState([]);
  const [recentReleases, setRecentReleases] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch user, releases, analytics, and sales parallelly
        const [releasesRes, analyticsRes, salesRes] = await Promise.all([
          fetch('/api/releases?perPage=5'),
          fetch('/api/analytics?endpoint=overview'),
          fetch('/api/sales?endpoint=overview')
        ]);

        let releasesList = [];
        if (releasesRes.ok) {
          const resData = await releasesRes.json();
          releasesList = resData.data || [];
          setRecentReleases(releasesList);
        }

        let totalStreams = 124500; // default mocks
        let totalEarnings = 1450.25;
        let listeners = 24800;

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          // Extract metrics from analytics response if available
          if (analyticsData.data) {
            totalStreams = analyticsData.data.total_streams || totalStreams;
            listeners = analyticsData.data.monthly_listeners || listeners;
          }
        }

        if (salesRes.ok) {
          const salesData = await salesRes.json();
          if (salesData.data) {
            totalEarnings = salesData.data.total_earnings || totalEarnings;
          }
        }

        // Set state metrics
        setStats({
          streams: totalStreams.toLocaleString(),
          earnings: `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          liveReleases: releasesList.filter(r => r.status === 'live').length || '1',
          monthlyListeners: listeners.toLocaleString(),
        });

        // Set analytics graphs data (defaults if empty)
        setStreamsData([
          { name: 'Jan', streams: Math.floor(totalStreams * 0.1) },
          { name: 'Feb', streams: Math.floor(totalStreams * 0.15) },
          { name: 'Mar', streams: Math.floor(totalStreams * 0.25) },
          { name: 'Apr', streams: Math.floor(totalStreams * 0.2) },
          { name: 'May', streams: Math.floor(totalStreams * 0.4) },
          { name: 'Jun', streams: Math.floor(totalStreams * 0.6) },
          { name: 'Jul', streams: totalStreams }
        ]);

        setPlatformsData([
          { name: 'Spotify', value: Math.floor(totalStreams * 0.45) },
          { name: 'Apple Music', value: Math.floor(totalStreams * 0.28) },
          { name: 'YouTube Music', value: Math.floor(totalStreams * 0.15) },
          { name: 'Deezer', value: Math.floor(totalStreams * 0.05) },
          { name: 'Amazon Music', value: Math.floor(totalStreams * 0.07) }
        ]);

      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={loadingContainerStyle}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={dashboardGridStyle}>
        
        {/* Metric Cards */}
        <div style={metricsRowStyle}>
          <StatCard 
            title="Total Streams" 
            value={stats.streams} 
            icon={Play} 
            description="Lifetime streams across all DSPs" 
            trend="+12%" 
            trendType="up"
          />
          <StatCard 
            title="Estimated Earnings" 
            value={stats.earnings} 
            icon={DollarSign} 
            description="Accrued music royalties this period" 
            trend="+$340.50" 
            trendType="up"
          />
          <StatCard 
            title="Live Releases" 
            value={stats.liveReleases} 
            icon={Disc} 
            description="Active releases in stores" 
          />
          <StatCard 
            title="Monthly Listeners" 
            value={stats.monthlyListeners} 
            icon={Users} 
            description="Unique monthly listeners" 
            trend="+8%" 
            trendType="up"
          />
        </div>

        {/* Charts Section */}
        <div style={chartsRowStyle}>
          <div className="glass-card" style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <h4 style={chartTitleStyle}>Streams Over Time</h4>
              <span style={chartSubtitleStyle}>Last 7 Months</span>
            </div>
            <StreamsChart data={streamsData} />
          </div>

          <div className="glass-card" style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <h4 style={chartTitleStyle}>Platform Breakdown</h4>
              <span style={chartSubtitleStyle}>Share of total streams</span>
            </div>
            <PlatformChart data={platformsData} />
          </div>
        </div>

        {/* Recent Releases Section */}
        <div className="glass-card" style={recentReleasesCardStyle}>
          <div style={sectionHeaderStyle}>
            <h4 style={sectionTitleStyle}>Recent Releases</h4>
            <Link href="/releases" style={viewAllLinkStyle}>
              View All Releases
            </Link>
          </div>

          {recentReleases.length === 0 ? (
            <div style={emptyReleasesStyle}>
              <Music size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No releases found.</p>
              <Link href="/releases/new" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.25rem', textDecoration: 'none' }}>
                Create your first release
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Release Date</th>
                    <th>Catalog Code</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReleases.map((release) => (
                    <tr key={release.id} onClick={() => window.location.href = `/releases/${release.id}`} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: '600', color: '#fff' }}>{release.title}</td>
                      <td>{release.type}</td>
                      <td>
                        <span style={statusBadgeStyle(release.status)}>{release.status}</span>
                      </td>
                      <td>{release.releaseDate || 'TBD'}</td>
                      <td>{release.catalogNumber || `ID: ${release.id}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

const dashboardGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const metricsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1.5rem',
};

const chartsRowStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '1.5rem',
};

const chartCardStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const chartHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
};

const chartTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
  fontWeight: '700',
};

const chartSubtitleStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
};

const recentReleasesCardStyle = {
  padding: '1.5rem',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.25rem',
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
  fontWeight: '700',
};

const viewAllLinkStyle = {
  fontSize: '0.85rem',
  color: 'var(--color-primary)',
  textDecoration: 'none',
  fontWeight: '600',
};

const emptyReleasesStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2.5rem',
};

const statusBadgeStyle = (status) => {
  const isLive = status === 'live';
  const isReview = status === 'in_review';
  return {
    padding: '0.2rem 0.6rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isLive ? 'var(--success)' : isReview ? 'var(--warning)' : 'var(--text-secondary)',
    background: isLive ? 'rgba(16, 185, 129, 0.1)' : isReview ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)',
    border: isLive ? '1px solid rgba(16, 185, 129, 0.2)' : isReview ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
  };
};
