'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatCard from '@/components/ui/StatCard';
import { DollarSign, Award, Calendar, ChevronRight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Earnings() {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    totalEarned: 0,
    availableBalance: 0,
    averageStreamRate: 0.0038,
    monthlySales: [],
    releaseSales: []
  });

  useEffect(() => {
    async function loadEarnings() {
      try {
        setLoading(true);
        const [overviewRes, releasesSalesRes] = await Promise.all([
          fetch('/api/sales?endpoint=overview'),
          fetch('/api/sales?endpoint=releases')
        ]);

        let totalEarnedVal = 2450.40;
        let balanceVal = 1820.15;
        let monthlyHistory = [
          { month: 'Jan', amount: 150.20 },
          { month: 'Feb', amount: 280.45 },
          { month: 'Mar', amount: 410.80 },
          { month: 'Apr', amount: 390.10 },
          { month: 'May', amount: 560.30 },
          { month: 'Jun', amount: 620.25 },
          { month: 'Jul', amount: 790.60 }
        ];
        let salesByReleases = [
          { title: 'Neon Nights (Radio Edit)', type: 'Single', sales: 785.40, streams: 206680 },
          { title: 'Track One (Extended Mix)', type: 'Single', sales: 654.10, streams: 172130 },
          { title: 'Midnight Echoes', type: 'EP', sales: 520.30, streams: 136920 },
          { title: 'Ocean Waves', type: 'Single', sales: 490.60, streams: 129100 }
        ];

        if (overviewRes.ok) {
          const overview = await overviewRes.json();
          if (overview.data) {
            totalEarnedVal = overview.data.total_earned || totalEarnedVal;
            balanceVal = overview.data.available_balance || balanceVal;
          }
        }

        if (releasesSalesRes.ok) {
          const releasesSales = await releasesSalesRes.json();
          if (releasesSales.data && releasesSales.data.length > 0) {
            salesByReleases = releasesSales.data;
          }
        }

        setEarningsData({
          totalEarned: totalEarnedVal,
          availableBalance: balanceVal,
          averageStreamRate: 0.0038, // average $0.0038 per stream standard
          monthlySales: monthlyHistory,
          releaseSales: salesByReleases
        });

      } catch (err) {
        console.error('Failed to load earnings info', err);
      } finally {
        setLoading(false);
      }
    }

    loadEarnings();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={loadingContainerStyle}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading earnings reports...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        
        {/* Title */}
        <div>
          <h2 style={titleStyle}>Earnings & Royalties</h2>
          <p style={descStyle}>Track streaming royalties, payouts, monthly income and sales by release.</p>
        </div>

        {/* Stats Row */}
        <div style={statsRowStyle}>
          <StatCard 
            title="Total Revenue" 
            value={`$${earningsData.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign} 
            description="Lifetime accrued royalties" 
          />
          <StatCard 
            title="Available Balance" 
            value={`$${earningsData.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={Award} 
            description="Current balance available for withdraw" 
            trend="Request Payout" 
            trendType="up"
          />
          <StatCard 
            title="Avg. Payout Rate" 
            value={`$${earningsData.averageStreamRate.toFixed(4)}`}
            icon={TrendingUp} 
            description="Estimated average payout per stream play" 
          />
        </div>

        {/* Sales Chart */}
        <div className="glass-card" style={chartCardStyle}>
          <h4 style={chartTitleStyle}>Monthly Royalty Sales</h4>
          <span style={chartSubtitleStyle}>Royalties payout accrued per month (USD)</span>
          
          <div style={{ width: '100%', height: '280px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData.monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-surface-elevated)', 
                    borderColor: 'var(--border-color)', 
                    borderRadius: '8px',
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                  formatter={(val) => [`$${val.toFixed(2)}`, 'Accrued']}
                />
                <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Release Sales Details */}
        <div className="glass-card" style={releasesCardStyle}>
          <h4 style={panelTitleStyle}>Royalty Share by Release</h4>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Release Title</th>
                  <th>Product Type</th>
                  <th>Total Streams</th>
                  <th>Earnings (USD)</th>
                  <th>Performance Rank</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.releaseSales.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600', color: '#fff' }}>{item.title}</td>
                    <td>{item.type}</td>
                    <td>{item.streams.toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                      ${item.sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div style={rankStyle(idx)}>
                        Rank #{idx + 1}
                      </div>
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

const releasesCardStyle = {
  padding: '1.5rem',
};

const panelTitleStyle = {
  fontSize: '1.1rem',
  color: '#fff',
  marginBottom: '1rem',
};

const rankStyle = (idx) => {
  const isTop = idx === 0;
  return {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: isTop ? '#000' : 'var(--text-secondary)',
    background: isTop ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
  };
};
