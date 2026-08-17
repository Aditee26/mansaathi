import { useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';
import MoodTrendChart from '../components/mood/MoodTrendChart';
import ActivityBarChart from '../components/activity/ActivityBarChart';
import { LoadingState, ErrorState } from '../components/common/States';
import './PageLayouts.css';

export default function Insights() {
  const [moodInsights, setMoodInsights] = useState(null);
  const [activitySummary, setActivitySummary] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const [moodRes, activityRes] = await Promise.all([
        api.get('/moods/insights?days=30'),
        api.get('/activities/summary?days=7'),
      ]);
      setMoodInsights(moodRes.data);
      setActivitySummary(activityRes.data);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Crunching your insights…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container page">
        <ErrorState message={errorMsg} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>Insights</h1>
          <p className="muted">Patterns, not verdicts — a gentle look at your last few weeks.</p>
        </div>
      </div>

      <div className="insights-stats">
        <div className="card insights-stat">
          <span className="muted text-sm">30-day average mood</span>
          <strong>{moodInsights?.average ? `${moodInsights.average.toFixed(1)} / 5` : '—'}</strong>
        </div>
        <div className="card insights-stat">
          <span className="muted text-sm">Check-ins logged</span>
          <strong>{moodInsights?.entriesLogged ?? 0} / {moodInsights?.days ?? 30}</strong>
        </div>
        <div className="card insights-stat">
          <span className="muted text-sm">Activities this week</span>
          <strong>{activitySummary?.totalCompleted ?? 0}</strong>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: 'var(--sp-6)' }}>
        <div className="card">
          <div className="section-title">
            <h3>Mood, last 30 days</h3>
          </div>
          <MoodTrendChart data={moodInsights?.trend} />
        </div>

        <div className="card">
          <div className="section-title">
            <h3>Activities, last 7 days</h3>
          </div>
          <ActivityBarChart byType={activitySummary?.byType} />
        </div>
      </div>
    </div>
  );
}
