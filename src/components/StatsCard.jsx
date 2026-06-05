import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ icon: Icon, label, value, change, color = 'var(--brand-primary)', prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const numValue = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(numValue)) {
      setDisplayValue(value);
      return;
    }

    hasAnimated.current = true;
    const duration = 1200;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(numValue * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numValue);
      }
    }
    requestAnimationFrame(animate);
  }, [value]);

  const formattedValue = typeof value === 'number'
    ? `${prefix}${displayValue.toLocaleString()}${suffix}`
    : value;

  return (
    <div className="stats-card" ref={ref}>
      {Icon && (
        <div className="stats-card-icon" style={{ background: `${color}18`, color }}>
          <Icon size={22} />
        </div>
      )}
      <div className="stats-card-value mono">{formattedValue}</div>
      <div className="stats-card-label">{label}</div>
      {change !== undefined && change !== null && (
        <div className={`stats-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change >= 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
  );
}
