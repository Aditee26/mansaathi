import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MoodTrendChart from '../components/mood/MoodTrendChart';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States';
import { moodByValue, formatDateTime } from '../utils/constants';
import './Dashboard.css';

const greetingForHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboard = useCallback(async () => {
    setStatus('loading');
    try {
      const { data: res } = await api.get('/dashboard');
      setData(res);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Getting your dashboard ready…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container page">
        <ErrorState message={errorMsg} onRetry={fetchDashboard} />
      </div>
    );
  }

  const todayMoodMeta = data.todayMood ? moodByValue(data.todayMood.mood) : null;
  const firstName = (user?.name || '').split(' ')[0];

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>{greetingForHour()}, {firstName || 'there'}.</h1>
          <p className="muted">Here's how your week is shaping up.</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card dash-mood-card">
          <span className="section-title-plain">Today's mood</span>
          {todayMoodMeta ? (
            <>
              <div className="dash-mood-display">
                <span className="dash-mood-emoji" aria-hidden="true">{todayMoodMeta.emoji}</span>
                <span className="dash-mood-label">{todayMoodMeta.label}</span>
              </div>
              {data.todayMood.note && <p className="dash-mood-note">"{data.todayMood.note}"</p>}
              <Link to="/moods" className="btn btn-secondary btn-sm">Update check-in</Link>
            </>
          ) : (
            <EmptyState
              title="You haven't checked in today"
              message="Take a moment to log how you're feeling."
              action={
                <Link to="/moods" className="btn btn-primary btn-sm">Check in now</Link>
              }
            />
          )}
        </div>

        <div className="card dash-summary-card">
          <span className="section-title-plain">This week</span>
          <div className="dash-summary-stats">
            <div>
              <strong>{data.weeklySummary.moodEntriesLogged}</strong>
              <span>check-ins</span>
            </div>
            <div>
              <strong>{data.weeklySummary.activitiesCompleted}</strong>
              <span>activities</span>
            </div>
            <div>
              <strong>{data.weeklySummary.activityMinutes}</strong>
              <span>minutes</span>
            </div>
            <div>
              <strong>{data.weeklyAverage ?? '—'}</strong>
              <span>avg mood</span>
            </div>
          </div>
        </div>

        <div className="card dash-trend-card">
          <div className="section-title">
            <h3>Mood trend, this week</h3>
            <Link to="/insights" className="muted-link">View all insights</Link>
          </div>
          <MoodTrendChart data={data.moodTrend} />
        </div>

        <div className="card dash-journal-card">
          <div className="section-title">
            <h3>Recent journal entries</h3>
            <Link to="/journal" className="muted-link">View journal</Link>
          </div>
          {data.recentJournals.length === 0 ? (
            <EmptyState
              title="No entries yet"
              message="Your most recent journal entries will appear here."
              action={<Link to="/journal" className="btn btn-primary btn-sm">Write an entry</Link>}
            />
          ) : (
            <ul className="dash-journal-list">
              {data.recentJournals.map((j) => (
                <li key={j._id}>
                  <span className="dash-journal-title">{j.title}</span>
                  <span className="muted text-sm">{formatDateTime(j.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
