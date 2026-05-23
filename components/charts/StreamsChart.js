'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function StreamsChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '300px', width: '100%' }} className="skeleton" />;
  }

  // Fallback mock data if none provided
  const chartData = data.length > 0 ? data : [
    { name: 'Jan', streams: 12000 },
    { name: 'Feb', streams: 19000 },
    { name: 'Mar', streams: 32000 },
    { name: 'Apr', streams: 28000 },
    { name: 'May', streams: 54000 },
    { name: 'Jun', streams: 85000 },
    { name: 'Jul', streams: 110000 }
  ];

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-muted)" 
            fontSize={11} 
            tickLine={false}
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={11} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
          />
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
            labelStyle={{ fontWeight: '700', color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="streams" 
            stroke="var(--color-primary)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorStreams)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
