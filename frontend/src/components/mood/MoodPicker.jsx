import { useState, useEffect } from 'react';
import { MOODS } from '../../utils/constants';
import './Mood.css';

export default function MoodPicker({ initialMood, initialNote = '', onSubmit, submitting }) {
  const [selected, setSelected] = useState(initialMood || null);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setSelected(initialMood || null);
    setNote(initialNote || '');
  }, [initialMood, initialNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onSubmit({ mood: selected, note });
  };

  return (
    <form onSubmit={handleSubmit} className="mood-picker">
      <div className="mood-options" role="radiogroup" aria-label="How are you feeling today?">
        {MOODS.map((m) => (
          <button
            type="button"
            key={m.value}
            role="radio"
            aria-checked={selected === m.value}
            className={`mood-option ${selected === m.value ? 'is-selected' : ''}`}
            style={{ '--mood-color': m.color }}
            onClick={() => setSelected(m.value)}
          >
            <span className="mood-emoji" aria-hidden="true">{m.emoji}</span>
            <span className="mood-label">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="field" style={{ marginTop: 'var(--sp-4)' }}>
        <label htmlFor="mood-note">Add a note (optional)</label>
        <textarea
          id="mood-note"
          className="textarea"
          rows={2}
          maxLength={280}
          placeholder="What's contributing to this feeling?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={!selected || submitting}>
        {submitting ? 'Saving…' : initialMood ? 'Update check-in' : 'Save check-in'}
      </button>
    </form>
  );
}
