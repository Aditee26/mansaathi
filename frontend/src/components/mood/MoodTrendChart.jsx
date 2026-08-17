import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MOODS, formatDayShort } from '../../utils/constants';
import { EmptyState } from '../common/States';

function MoodTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const meta = MOODS.find((m) => m.value === point.mood);
  return (
    <div className="chart-tooltip">
      <strong>{meta?.emoji} {meta?.label}</strong>
      <span>{formatDayShort(label)}</span>
    </div>
  );
}

export default function MoodTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No mood check-ins yet"
        message="Log your first mood and a trend line will appear here."
      />
    );
  }

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDayShort}
            tick={{ fontSize: 12, fill: 'var(--color-ink-faint)' }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 12, fill: 'var(--color-ink-faint)' }}
            axisLine={false}
            tickLine={false}
            width={20}
          />
          <Tooltip content={<MoodTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--color-teal)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-teal)', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
