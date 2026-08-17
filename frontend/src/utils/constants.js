// Kept in sync with the backend enums (Mood.js, Activity.js). Centralizing
// display metadata here means components never hardcode labels/colors.

export const MOODS = [
  { value: 'awful', label: 'Awful', emoji: '😞', color: 'var(--mood-awful)' },
  { value: 'low', label: 'Low', emoji: '😕', color: 'var(--mood-low)' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'var(--mood-okay)' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'var(--mood-good)' },
  { value: 'great', label: 'Great', emoji: '😄', color: 'var(--mood-great)' },
];

export const moodByValue = (value) => MOODS.find((m) => m.value === value);

export const ACTIVITY_TYPES = [
  { value: 'meditation', label: 'Meditation', icon: '🧘' },
  { value: 'exercise', label: 'Exercise', icon: '🏃' },
  { value: 'sleep', label: 'Sleep', icon: '🌙' },
  { value: 'hydration', label: 'Hydration', icon: '💧' },
  { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
  { value: 'social-connection', label: 'Social connection', icon: '💬' },
  { value: 'outdoors', label: 'Outdoors', icon: '🌿' },
  { value: 'reading', label: 'Reading', icon: '📖' },
];

export const activityByValue = (value) => ACTIVITY_TYPES.find((a) => a.value === value);

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDayShort = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
};
