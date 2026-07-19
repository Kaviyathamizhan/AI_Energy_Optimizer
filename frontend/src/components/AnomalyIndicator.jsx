import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SEVERITY_LABEL = { low: 'Normal', medium: 'Warning', high: 'Anomaly' };

// Custom dot renderer for plotting anomalies
const AnomalyDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;

  if (payload.anomaly) {
    return (
      <circle cx={cx} cy={cy} r={5} fill="var(--color-alert)" stroke="#ffffff" strokeWidth={1} />
    );
  }
  return (
    <circle cx={cx} cy={cy} r={2} fill="var(--color-normal)" stroke="none" />
  );
};

export default function AnomalyIndicator({ anomaly, history = [] }) {
  if (!anomaly && history.length === 0) {
    return (
      <div className="card" style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Awaiting readings to monitor anomalies.</p>
      </div>
    );
  }

  const severity   = anomaly?.flag ? (anomaly.severity || 'medium') : 'low';
  const label      = anomaly?.flag ? SEVERITY_LABEL[severity] : 'Normal';
  const isAlert    = anomaly?.flag;

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 className="card-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Anomaly Monitoring</h2>
        <span className="badge" style={{ fontSize: '11px' }}>Isolation Forest</span>
      </div>

      <div className="anomaly-status-row" style={{ marginBottom: '16px' }}>
        <div className={`anomaly-status-badge ${isAlert ? 'alert' : 'normal'}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
          <span>{isAlert ? '⚠' : '✓'}</span>
          <span>{label}</span>
        </div>
        
        {anomaly && (
          <div className="anomaly-meta-text" style={{ fontSize: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span>Sigma Distance: <strong className="mono-val" style={{ color: 'var(--text)' }}>{anomaly.details?.sigma_distance ?? '—'} σ</strong></span>
            <span style={{ color: 'var(--border)' }}>•</span>
            <span>Deviation Ratio: <strong className="mono-val" style={{ color: 'var(--text)' }}>{anomaly.details?.ratio ?? '—'}x</strong></span>
          </div>
        )}
      </div>

      {/* FULL SESSION TIMELINE VIEW */}
      {history.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Historical Monitoring
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Readings: <strong style={{ color: 'var(--text)' }}>{history.length}</strong> total • Anomalies: <strong style={{ color: 'var(--color-alert)' }}>{history.filter(d => Boolean(d.anomaly)).length}</strong>
            </span>
          </div>

          <div style={{ height: '220px', width: '100%', minHeight: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis dataKey="label" tick={{ fill: '#8e95a5', fontSize: 11 }} stroke="#202226" />
                <YAxis unit=" kWh" tick={{ fill: '#8e95a5', fontSize: 11 }} stroke="#202226" />
                <Tooltip 
                  contentStyle={{ background: '#141619', border: '1px solid #202226', borderRadius: 4, fontSize: '12px' }}
                  formatter={(value, name, props) => [
                    `${value} kWh ${props.payload.anomaly ? '(ANOMALY)' : ''}`, 
                    'Load'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8e95a5" 
                  strokeWidth={2}
                  dot={<AnomalyDot />} 
                  activeDot={{ r: 5 }} 
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
