import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ACTIVITY_TYPES } from '../../utils/constants';
import { EmptyState } from '../common/States';

export default function ActivityBarChart({ byType }) {
  const data = ACTIVITY_TYPES.map((t) => ({
    name: t.label,
    icon: t.icon,
    count: byType?.[t.value]?.count || 0,
  }));

  const hasData = data.some((d) => d.count > 0);
  if (!hasData) {
    return (
      <EmptyState
        title="No activities logged this week"
        message="Log a wellness activity and this chart will fill in."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-ink-faint)' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 12, fill: 'var(--color-ink-soft)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-bg-muted)' }}
          contentStyle={{
            background: 'var(--color-ink)',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#fff',
          }}
        />
        <Bar dataKey="count" fill="var(--color-sage)" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
