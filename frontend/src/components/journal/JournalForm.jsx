import { useState, useEffect } from 'react';
import { MOODS } from '../../utils/constants';

export default function JournalForm({ initial, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [mood, setMood] = useState(initial?.mood || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initial?.title || '');
    setContent(initial?.content || '');
    setMood(initial?.mood || '');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Write something before saving.');
      return;
    }
    setError('');
    onSubmit({ title: title.trim() || 'Untitled entry', content: content.trim(), mood: mood || null });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="field">
        <label htmlFor="journal-title">Title (optional)</label>
        <input
          id="journal-title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this entry a name"
          maxLength={120}
        />
      </div>

      <div className="field">
        <label htmlFor="journal-content">What's on your mind?</label>
        <textarea
          id="journal-content"
          className="textarea"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely — this stays private to you."
          maxLength={10000}
        />
      </div>

      <div className="field">
        <label htmlFor="journal-mood">Tag a mood (optional)</label>
        <select id="journal-mood" className="select" value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">No mood tag</option>
          {MOODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.emoji} {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ gap: 'var(--sp-3)' }}>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save entry'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
