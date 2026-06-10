// Bar chart for recent session performance

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import './PerformanceChart.css';

const PERIODS = ['Last 7 Days', 'Last 30 Days', 'This Month'];

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].value} sessions</p>
      </div>
    );
  }
  return null;
}

export default function PerformanceChart({ data = [], loading = false, onPeriodChange }) {
  const [activePeriod, setActivePeriod] = useState('Last 7 Days');

  const handlePeriod = (period) => {
    setActivePeriod(period);
    onPeriodChange?.(period);
  };

  // Find the max bar to highlight it green
  const maxVal = data.length ? Math.max(...data.map((d) => d.sessions)) : 0;

  return (
    <div className="performance-chart-card">
      <div className="chart-card-header">
        <div className="chart-title-row">
          <span className="chart-trend-icon">↗</span>
          <h3 className="chart-title">Recent Performance</h3>
        </div>
        <div className="chart-period-selector">
          {PERIODS.map((p) => (
            <button
              key={p}
              className={`period-btn ${activePeriod === p ? 'active' : ''}`}
              onClick={() => handlePeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-body">
        {loading ? (
          <div className="chart-loading">
            <div className="chart-skeleton-bars">
              {[3, 5, 4, 8, 6, 4, 5].map((h, i) => (
                <div key={i} className="skeleton-bar" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="chart-empty">
            <p>No performance data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -30 }} barSize={28}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.sessions === maxVal ? '#1a9e6e' : '#c8ede0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}