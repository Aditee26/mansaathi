import { moodByValue, formatDateTime } from '../../utils/constants';
import './Journal.css';

export default function JournalCard({ journal, onEdit, onDelete }) {
  const mood = journal.mood ? moodByValue(journal.mood) : null;
  const preview =
    journal.content.length > 220 ? `${journal.content.slice(0, 220)}…` : journal.content;

  return (
    <article className="journal-card">
      <div className="journal-card-header">
        <div>
          <h4>{journal.title}</h4>
          <span className="muted text-sm">{formatDateTime(journal.createdAt)}</span>
        </div>
        {mood && (
          <span className="badge" title={mood.label}>
            {mood.emoji} {mood.label}
          </span>
        )}
      </div>
      <p className="journal-card-preview">{preview}</p>
      <div className="journal-card-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(journal)}>
          Edit
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(journal)}>
          Delete
        </button>
      </div>
    </article>
  );
}
