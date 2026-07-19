import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * OptimizationPanel — Visualizes before vs after load profile and extrapolated cost impact.
 */
export default function OptimizationPanel({ optimization }) {
  if (!optimization) {
    return (
      <div className="card" style={{ minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Enable "Run LP cost optimizer" to calculate shifting curves.</p>
      </div>
    );
  }

  const { original_cost, optimized_cost, savings, original_profile, optimized_profile } = optimization;

  // Build chart array from 48-length lists
  const chartData = [];
  if (original_profile && optimized_profile && original_profile.length === 48) {
    for (let i = 0; i < 48; i++) {
      chartData.push({
        hour: i,
        OriginalLoad: original_profile[i],
        OptimizedLoad: optimized_profile[i]
      });
    }
  }

  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="card-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Cost Optimization</h2>
        <span className="badge" style={{ fontSize: '11px' }}>Horizon: 48h</span>
      </div>

      {/* Prominent cost details grid with Hero Estimated Savings */}
      <div className="opt-stats-grid" style={{ gap: '14px', marginBottom: '16px', paddingBottom: '14px' }}>
        <div className="opt-metric">
          <span className="opt-metric-label" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Original Cost</span>
          <strong className="opt-metric-value mono-val" style={{ color: 'var(--text)', fontSize: '14px' }}>
            Rs. {original_cost?.toFixed(2)}
          </strong>
        </div>
        <div className="opt-metric">
          <span className="opt-metric-label" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Optimized Cost</span>
          <strong className="opt-metric-value mono-val" style={{ color: 'var(--color-normal)', fontSize: '14px' }}>
            Rs. {optimized_cost?.toFixed(2)}
          </strong>
        </div>
        <div className="opt-metric" style={{ background: 'rgba(86, 166, 75, 0.08)', padding: '6px 10px', borderRadius: 'var(--radius)', border: '1px solid rgba(86, 166, 75, 0.2)' }}>
          <span className="opt-metric-label" style={{ textTransform: 'none', fontSize: '11px', color: '#73bf69', fontWeight: 600 }}>Estimated Savings (48 Hours)</span>
          <strong className="opt-metric-value mono-val" style={{ color: '#73bf69', fontSize: '18px', fontWeight: 700 }}>
            Rs. {savings?.toFixed(2)}
          </strong>
        </div>
        <div className="opt-metric" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
          <span className="opt-metric-label" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Monthly Savings</span>
          <strong className="opt-metric-value mono-val" style={{ color: 'var(--color-savings)', fontSize: '15px' }}>
            Rs. {((savings / 2) * 30).toFixed(0)}
          </strong>
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ height: '320px', width: '100%', minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrig" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8e95a5" stopOpacity={0.06}/>
                    <stop offset="95%" stopColor="#8e95a5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff780a" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ff780a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis dataKey="hour" tick={{ fill: '#8e95a5', fontSize: 11 }} stroke="#202226" />
                <YAxis unit=" kWh" tick={{ fill: '#8e95a5', fontSize: 11 }} stroke="#202226" />
                <Tooltip 
                  contentStyle={{ background: '#141619', border: '1px solid #202226', borderRadius: 4, fontSize: '12px' }}
                  formatter={(value) => [`${value.toFixed(3)} kWh`]}
                />
                <Legend verticalAlign="top" align="right" height={32} wrapperStyle={{ fontSize: 11, paddingBottom: '12px' }}/>
                <Area 
                  type="monotone" 
                  dataKey="OriginalLoad" 
                  stroke="#8e95a5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorOrig)" 
                  name="Original Load"
                  animationDuration={500}
                />
                <Area 
                  type="monotone" 
                  dataKey="OptimizedLoad" 
                  stroke="#ff780a" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorOpt)" 
                  name="Optimized Load"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {savings > 0 && (
        <div className="action-box" style={{ marginTop: '16px', padding: '12px 14px' }}>
          <div className="action-box-icon" style={{ fontSize: '14px' }}>ℹ</div>
          <span className="action-box-text" style={{ fontSize: '12px', lineHeight: 1.4 }}>
            <strong>Suggested Action:</strong> Shift flexible equipment usage outside peak tariff hours (16:00–21:00) whenever operationally feasible to reduce electricity cost.
          </span>
        </div>
      )}
    </div>
  );
}
