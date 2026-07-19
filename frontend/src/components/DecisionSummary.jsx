import React from 'react';

/**
 * DecisionSummary
 * Displays compact decision metrics and model performance analytics.
 */
export default function DecisionSummary({ forecast, anomaly, optimization, history }) {
  if (!forecast && !anomaly && !optimization) {
    return (
      <div className="card" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Awaiting telemetry data to calculate decision parameters.</p>
      </div>
    );
  }

  const isAnomaly = anomaly?.flag;
  const currentPred = forecast?.forecast_kWh != null 
    ? `${forecast.forecast_kWh.toFixed(3)} kWh` 
    : '—';

  const optShift = optimization?.savings_pct != null
    ? `${optimization.savings_pct.toFixed(1)}% shift`
    : '—';

  const monthlyEst = optimization?.savings != null
    ? `Rs. ${((optimization.savings / 2) * 30).toFixed(0)}`
    : 'Rs. 0';

  const recommendation = isAnomaly
    ? 'High consumption deviation detected. Audit active appliances.'
    : optimization?.savings > 0
      ? 'Shift flexible loads outside peak hours (16:00-21:00).'
      : 'Maintain normal grid cycles. Current load remains within baseline.';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 className="card-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Decision Summary</h2>
      </div>

      <div className="decision-grid" style={{ gap: '12px' }}>
        <div className="decision-section">
          <span className="decision-sect-title" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Current Status</span>
          <span 
            className="decision-sect-desc" 
            style={{ 
              color: isAnomaly ? 'var(--color-alert)' : 'var(--color-normal)',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            {isAnomaly ? '⚠ High Consumption' : '✓ Normal'}
          </span>
        </div>

        <div className="decision-section">
          <span className="decision-sect-title" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Predicted Load</span>
          <span className="decision-sect-desc mono-val" style={{ color: 'var(--color-forecast)', fontSize: '13px' }}>
            {currentPred}
          </span>
        </div>

        <div className="decision-section">
          <span className="decision-sect-title" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Optimization Applied</span>
          <span className="decision-sect-desc mono-val" style={{ color: 'var(--color-optimized)', fontSize: '13px' }}>
            {optShift}
          </span>
        </div>

        <div className="decision-section">
          <span className="decision-sect-title" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Monthly Savings</span>
          <span className="decision-highlight-val mono-val" style={{ fontSize: '16px' }}>
            {monthlyEst}
          </span>
        </div>

        <div className="decision-section decision-fullwidth" style={{ padding: '12px' }}>
          <span className="decision-sect-title" style={{ textTransform: 'none', fontSize: '11px', color: 'var(--text-muted)' }}>Recommended Action</span>
          <span className="decision-sect-desc" style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.4, marginTop: '2px' }}>
            {recommendation}
          </span>
        </div>
      </div>

      {/* Model Performance section as lightweight metadata footer */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '2px' }}>
        <h3 style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'none', marginBottom: '8px' }}>
          Model Performance
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span>Forecast Model: <strong style={{ color: 'var(--text)' }}>LightGBM</strong></span>
            <span>RMSE: <strong className="mono-val" style={{ color: 'var(--text)' }}>0.5035</strong></span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid rgba(32, 34, 38, 0.4)', paddingTop: '6px' }}>
            <span>Precision: <strong className="mono-val" style={{ color: 'var(--text)' }}>84.6%</strong></span>
            <span>Recall: <strong className="mono-val" style={{ color: 'var(--text)' }}>73.3%</strong></span>
            <span>F1 Score: <strong className="mono-val" style={{ color: 'var(--color-savings)' }}>0.786</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
