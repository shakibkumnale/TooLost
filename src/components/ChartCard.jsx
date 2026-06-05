import { ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, action, children, height = 300 }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h4 className="chart-card-title">{title}</h4>
        {action && <div>{action}</div>}
      </div>
      <div className="chart-card-body">
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
