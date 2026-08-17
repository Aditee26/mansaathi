import { useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';
import ActivityForm from '../components/activity/ActivityForm';
import ActivityItem from '../components/activity/ActivityItem';
import { LoadingState, EmptyState, ErrorState } from '../components/common/States';
import { ACTIVITY_TYPES } from '../utils/constants';
import './PageLayouts.css';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const [activitiesRes, summaryRes] = await Promise.all([
        api.get('/activities?days=14'),
        api.get('/activities/summary?days=7'),
      ]);
      setActivities(activitiesRes.data.activities);
      setSummary(summaryRes.data);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/activities', payload);
      setActivities((prev) => [data.activity, ...prev]);
      // Refresh summary since a new completed activity affects the weekly totals
      const { data: summaryData } = await api.get('/activities/summary?days=7');
      setSummary(summaryData);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (activity) => {
    if (!window.confirm('Remove this logged activity?')) return;
    try {
      await api.delete(`/activities/${activity._id}`);
      setActivities((prev) => prev.filter((a) => a._id !== activity._id));
      const { data: summaryData } = await api.get('/activities/summary?days=7');
      setSummary(summaryData);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>Wellness activities</h1>
          <p className="muted">Small, repeatable practices — logged as they happen.</p>
        </div>
      </div>

      {status === 'loading' && <LoadingState label="Loading your activity log…" />}
      {status === 'error' && <ErrorState message={errorMsg} onRetry={fetchData} />}

      {status === 'ready' && (
        <div className="two-col">
          <div className="stack" style={{ gap: 'var(--sp-6)' }}>
            <div className="card">
              <div className="section-title">
                <h3>Log an activity</h3>
              </div>
              <ActivityForm onSubmit={handleCreate} submitting={submitting} />
            </div>

            <div className="card">
              <div className="section-title">
                <h3>Last 7 days</h3>
                <span className="muted text-sm">{summary?.totalCompleted || 0} completed</span>
              </div>
              <div className="summary-grid">
                {ACTIVITY_TYPES.map((type) => {
                  const stat = summary?.byType?.[type.value] || { count: 0, minutes: 0 };
                  return (
                    <div className="summary-tile" key={type.value}>
                      <span className="summary-tile-icon" aria-hidden="true">{type.icon}</span>
                      <span className="summary-tile-count">{stat.count}</span>
                      <span className="summary-tile-label">
                        {type.label}
                        {stat.minutes > 0 ? ` · ${stat.minutes}m` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title">
              <h3>Recent log</h3>
            </div>
            {activities.length === 0 ? (
              <EmptyState
                title="No activities logged yet"
                message="Log your first wellness activity using the form."
              />
            ) : (
              <ul className="activity-list">
                {activities.map((activity) => (
                  <ActivityItem key={activity._id} activity={activity} onDelete={handleDelete} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
