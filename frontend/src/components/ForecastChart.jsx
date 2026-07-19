import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';

/**
 * ForecastChart — Line chart with confidence-interval shaded band.
 * Highlights anomaly points with a red reference line.
 *
 * Props:
 *   history: Array<{ label: string, actual: number, forecast: number, q05: number, q95: number, anomaly: boolean }>
 */
export default function ForecastChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="card" style={{ minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Awaiting readings to display forecast graph.</p>
      </div>
    );
  }

  // Convert histories into stacked chart ranges
  const chartData = history.map(d => ({
    label: d.label,
    actual:       d.actual,
    forecast:     d.forecast,
    ci_lower:     d.q05,
    ci_band:      d.q95 != null && d.q05 != null ? +(d.q95 - d.q05).toFixed(4) : 0,
    anomaly:      d.anomaly,
  }));

  const anomalyLabels = chartData.filter(d => d.anomaly).map(d => d.label);

  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="card-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Load Forecast & Confidence Interval
        </h2>
        <span className="badge" style={{ fontSize: '11px' }}>Horizon: 24h</span>
      </div>
      
      <div style={{ height: '360px', width: '100%', minHeight: '360px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8e95a5' }} stroke="#202226" />
            <YAxis unit=" kWh" tick={{ fontSize: 11, fill: '#8e95a5' }} stroke="#202226" />
            <Tooltip
              contentStyle={{ background: '#141619', border: '1px solid #202226', borderRadius: 4 }}
              labelStyle={{ color: '#8e95a5', fontWeight: 600, fontSize: '11px' }}
              itemStyle={{ color: '#ebedf0', fontSize: '12px', padding: '3px 0' }}
              formatter={(v, name) => [v != null ? v.toFixed(3) + ' kWh' : '—', name]}
            />
            <Legend verticalAlign="top" align="right" height={32} wrapperStyle={{ fontSize: 11, paddingBottom: '12px' }} />

            {/* Confidence interval band */}
            <Area
              type="monotone"
              dataKey="ci_lower"
              stroke="none"
              fill="transparent"
              name="CI Lower"
              legendType="none"
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="ci_band"
              stackId="ci"
              stroke="none"
              fill="rgba(87, 148, 242, 0.15)"
              fillOpacity={1}
              name="90% Confidence Interval"
              animationDuration={500}
            />

            {/* Actual consumption (Blue) */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#5794f2"
              strokeWidth={2.5}
              fill="none"
              dot={{ r: 3, stroke: '#5794f2', strokeWidth: 1.5, fill: '#141619' }}
              activeDot={{ r: 5, fill: '#5794f2', stroke: '#141619', strokeWidth: 1.5 }}
              name="Actual Consumption"
              animationDuration={500}
            />

            {/* Forecast (Purple) */}
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#b877db"
              strokeWidth={2.5}
              strokeDasharray="4 3"
              fill="none"
              dot={false}
              name="Forecast"
              animationDuration={500}
            />

            {/* Anomaly markers */}
            {anomalyLabels.map(label => (
              <ReferenceLine
                key={label}
                x={label}
                stroke="var(--color-alert)"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{ value: '⚠', position: 'top', fill: 'var(--color-alert)', fontSize: 11, fontWeight: 700 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
