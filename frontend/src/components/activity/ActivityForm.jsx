import { useState } from 'react';
import { ACTIVITY_TYPES } from '../../utils/constants';

const NEEDS_DURATION = new Set(['meditation', 'exercise', 'sleep', 'reading']);

export default function ActivityForm({ onSubmit, submitting }) {
  const [type, setType] = useState('meditation');
  const [duration, setDuration] = useState(10);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      duration: NEEDS_DURATION.has(type) ? Number(duration) || 0 : 0,
      note: note.trim(),
      completed: true,
    });
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <div className="field">
        <label htmlFor="activity-type">Activity</label>
        <select id="activity-type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
          {ACTIVITY_TYPES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.icon} {a.label}
            </option>
          ))}
        </select>
      </div>

      {NEEDS_DURATION.has(type) && (
        <div className="field">
          <label htmlFor="activity-duration">Duration (minutes)</label>
          <input
            id="activity-duration"
            type="number"
            min="0"
            max="1440"
            className="input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="activity-note">Note (optional)</label>
        <input
          id="activity-note"
          type="text"
          className="input"
          maxLength={200}
          placeholder="Anything worth remembering?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Logging…' : 'Log activity'}
      </button>
    </form>
  );
}
