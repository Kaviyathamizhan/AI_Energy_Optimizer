import React, { useState } from 'react';

/**
 * PredictionForm — Input fields for timestamp + consumption.
 * Calls onSubmit(datetime, consumption, runOptimizer).
 */
export default function PredictionForm({ onSubmit, loading }) {
  const [datetime, setDatetime] = useState('2007-01-15T18:00:00');
  const [consumption, setConsumption] = useState('1.42');
  const [runOptimizer, setRunOptimizer] = useState(true);
  const [error, setError] = useState('');

  function triggerSubmit(dt, cons, opt) {
    setError('');
    const c = parseFloat(cons);
    if (isNaN(c) || c < 0 || c > 100) {
      setError('Consumption must be a number between 0 and 100 kWh.');
      return;
    }
    onSubmit(dt, c, opt);
  }

  function handleSubmit(e) {
    e.preventDefault();
    triggerSubmit(datetime, consumption, runOptimizer);
  }

  // Recruiter Demo actions - styled as secondary actions with reduced visual weight
  function handleNormalDemo() {
    const dt = '2007-01-15T18:00:00';
    const cons = '1.42';
    setDatetime(dt);
    setConsumption(cons);
    setRunOptimizer(true);
    triggerSubmit(dt, cons, true);
  }

  function handlePeakDemo() {
    const dt = '2007-01-15T19:00:00';
    const cons = '3.25';
    setDatetime(dt);
    setConsumption(cons);
    setRunOptimizer(true);
    triggerSubmit(dt, cons, true);
  }

  function handleAnomalyDemo() {
    const dt = '2007-01-15T20:00:00';
    const cons = '7.50';
    setDatetime(dt);
    setConsumption(cons);
    setRunOptimizer(true);
    triggerSubmit(dt, cons, true);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="card-title">Telemetry Input</h2>

      <div className="form-section" style={{ gap: '14px' }}>
        <div className="form-group">
          <label htmlFor="timestamp-input" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Timestamp</label>
          <input
            id="timestamp-input"
            type="datetime-local"
            step="3600"
            className="form-input"
            value={datetime.slice(0, 16)}
            onChange={e => setDatetime(e.target.value + ':00')}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="consumption-input" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Consumption (kWh)</label>
          <input
            id="consumption-input"
            type="number"
            min="0"
            max="100"
            step="0.01"
            className="form-input"
            value={consumption}
            onChange={e => setConsumption(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <label className="form-checkbox" style={{ fontSize: '12px', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={runOptimizer}
            onChange={e => setRunOptimizer(e.target.checked)}
            disabled={loading}
          />
          Run LP cost optimizer
        </label>

        {error && <div className="error-banner">{error}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '9px 12px' }}>
            {loading && <div className="spinner" />}
            {loading ? 'Running...' : 'Submit Reading'}
          </button>
          
          <div className="badge badge-green" style={{ flexShrink: 0, padding: '7px 10px', height: '34px', borderRadius: 'var(--radius)' }}>
            <span className="badge-dot badge-dot-green" />
            <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 500 }}>Live inference</span>
          </div>
        </div>

        {/* Recruiter Quick Actions Panel */}
        <div className="demo-panel" style={{ marginTop: '6px', paddingTop: '12px' }}>
          <span className="demo-title" style={{ fontSize: '11px', textTransform: 'none', fontWeight: 600, color: 'var(--text-muted)' }}>Quick Demo Scenarios</span>
          <div className="demo-btn-group" style={{ gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              className="demo-btn"
              onClick={handleNormalDemo}
              disabled={loading}
              style={{ padding: '6px 8px' }}
            >
              Normal
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={handlePeakDemo}
              disabled={loading}
              style={{ padding: '6px 8px' }}
            >
              Peak
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={handleAnomalyDemo}
              disabled={loading}
              style={{ padding: '6px 8px' }}
            >
              Anomaly
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
