import { useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';
import MoodPicker from '../components/mood/MoodPicker';
import MoodTrendChart from '../components/mood/MoodTrendChart';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States';
import { moodByValue, formatDate } from '../utils/constants';
import './PageLayouts.css';

export default function Moods() {
  const [todayMood, setTodayMood] = useState(null);
  const [insights, setInsights] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const [todayRes, insightsRes, historyRes] = await Promise.all([
        api.get('/moods/today'),
        api.get('/moods/insights?days=14'),
        api.get('/moods?days=30'),
      ]);
      setTodayMood(todayRes.data.mood);
      setInsights(insightsRes.data);
      setHistory(historyRes.data.moods);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async ({ mood, note }) => {
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const { data } = await api.post('/moods', { mood, note });
      setTodayMood(data.mood);
      setSuccessMsg('Check-in saved.');
      const [insightsRes, historyRes] = await Promise.all([
        api.get('/moods/insights?days=14'),
        api.get('/moods?days=30'),
      ]);
      setInsights(insightsRes.data);
      setHistory(historyRes.data.moods);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Loading your mood history…" />
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
          <h1>Moods</h1>
          <p className="muted">One check-in a day — honest is more useful than positive.</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="section-title">
            <h3>{todayMood ? "Today's check-in" : 'How are you feeling today?'}</h3>
          </div>
          {successMsg && <div className="alert alert-success">{successMsg}</div>}
          <MoodPicker
            initialMood={todayMood?.mood}
            initialNote={todayMood?.note}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>

        <div className="card">
          <div className="section-title">
            <h3>14-day trend</h3>
            {insights?.average && (
              <span className="muted text-sm">Average {insights.average.toFixed(1)} / 5</span>
            )}
          </div>
          <MoodTrendChart data={insights?.trend} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--sp-6)' }}>
        <div className="section-title">
          <h3>History</h3>
        </div>
        {history.length === 0 ? (
          <EmptyState title="No entries yet" message="Your check-in history will show up here." />
        ) : (
          <ul className="mood-history-list">
            {history.map((entry) => {
              const meta = moodByValue(entry.mood);
              return (
                <li key={entry._id} className="mood-history-row">
                  <span className="mood-history-emoji" aria-hidden="true">{meta?.emoji}</span>
                  <div className="mood-history-details">
                    <span className="mood-history-label">{meta?.label}</span>
                    <span className="muted text-sm">{formatDate(entry.date)}</span>
                  </div>
                  {entry.note && <p className="mood-history-note">{entry.note}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
