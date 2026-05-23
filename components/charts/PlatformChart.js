'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function PlatformChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '300px', width: '100%' }} className="skeleton" />;
  }

  // Fallback mock data if none provided
  const chartData = data.length > 0 ? data : [
    { name: 'Spotify', value: 45000 },
    { name: 'Apple Music', value: 30000 },
    { name: 'YouTube Music', value: 15000 },
    { name: 'Deezer', value: 5000 },
    { name: 'Amazon Music', value: 15000 }
  ];

  const COLORS = ['#1db954', '#fc3c44', '#ff0000', '#ff007f', '#00a8e1'];

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              background: 'var(--bg-surface-elevated)', 
              borderColor: 'var(--border-color)', 
              borderRadius: '8px',
              fontFamily: 'var(--font-jakarta)',
              fontSize: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ 
              fontFamily: 'var(--font-jakarta)',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
