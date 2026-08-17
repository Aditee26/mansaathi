import { activityByValue, formatDateTime } from '../../utils/constants';
import './Activity.css';

export default function ActivityItem({ activity, onDelete }) {
  const meta = activityByValue(activity.type);

  return (
    <li className="activity-item">
      <span className="activity-icon" aria-hidden="true">{meta?.icon || '✓'}</span>
      <div className="activity-details">
        <span className="activity-name">{meta?.label || activity.type}</span>
        <span className="muted text-sm">
          {formatDateTime(activity.date)}
          {activity.duration > 0 ? ` · ${activity.duration} min` : ''}
        </span>
        {activity.note && <p className="activity-note">{activity.note}</p>}
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onDelete(activity)}
        aria-label="Delete activity"
      >
        Remove
      </button>
    </li>
  );
}
